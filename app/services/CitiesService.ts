import axios from 'axios';
import Config from 'react-native-config';

import { FoundCity } from '../types/api/FoundCity';

import popularCities from '../../assets/jsons/popularCities.json';
import { SavedCity } from '../types/storage/SavedCity';

const OSM_SEARCH_URL: string = 'https://nominatim.openstreetmap.org/search';
const OWM_SEARCH_URL: string = 'http://api.openweathermap.org/geo/1.0/direct';
const OSM_REVERSE_URL: string = 'https://nominatim.openstreetmap.org/reverse';

const OSM_BOUNDARY_KEY: string = 'ISO3166-2-lvl4';

export function getPopularCities(): FoundCity[] {
  return popularCities;
}

let inputTimeout: NodeJS.Timeout | null = null;

export function findCitiesWithTimeout(
  query: string,
  lang: string,
  callback: (cities: FoundCity[]) => void
) {
  if (inputTimeout) {
    clearTimeout(inputTimeout);
  }

  inputTimeout = setTimeout(() => {
    findCitiesOSMAsync(query, lang).then(callback);
  }, 500);
}

function extractRegionFromOSM(address: any): string {
  let region = '';
  let end = Object.keys(address).indexOf(OSM_BOUNDARY_KEY);
  if (end > 1) {
    region = Object.values(address)
      .slice(1, end)
      .join(', ');
  }
  return region;
}

export async function findCitiesOSMAsync(query: string, lang: string): Promise<FoundCity[]> {
  // Potential exception ignored beacuse there is no need to handle it
  let response = await axios.get(OSM_SEARCH_URL, {
    params: {
      city: query,
      format: 'geojson',
      featureType: 'settlement',
      addressdetails: 1,
    },
    headers: {
      'Accept-Language': 'ru', // 'lang' in future
    },
  });

  let foundCities: any[] = response.data.features;
  return foundCities.map((cityJson): FoundCity => {
    let address = cityJson.properties.address;

    let name = cityJson.properties.name;
    let country = address.country;
    let lon = cityJson.geometry.coordinates[0];
    let lat = cityJson.geometry.coordinates[1];

    // Extract region
    let region = extractRegionFromOSM(address);

    return {
      name: name,
      region: region,
      country: country,
      longitude: lon,
      latitude: lat,
    };
  });
}

export async function findCitiesOWMAsync(query: string): Promise<FoundCity[]> {
  // Potential exception ignored beacuse there is no need to handle it
  let response = await axios.get(OWM_SEARCH_URL, {
    params: {
      appid: Config.OWM_API_KEY,
      q: query,
      limit: 5,
    },
  });

  let foundCities: any[] = response.data;
  return foundCities.map((cityJson) => {
    let c: FoundCity = {
      name: cityJson?.local_names?.ru ?? cityJson.name,
      region: cityJson.state ?? '',
      country: cityJson.country,
      longitude: cityJson.lon,
      latitude: cityJson.lat,
    };

    return c;
  });
}

export async function getCityFromCoordsOSM(lat: number, lon: number, lang: string): Promise<FoundCity> {
  const response = await axios.get(OSM_REVERSE_URL, {
    params: {
      lat: lat,
      lon: lon,
      format: 'geojson',
      zoom: 15, // 'any settlement'
      addressdetails: 1,
    },
    headers: {
      'Accept-Language': 'ru', // 'lang' in future
    },
  });

  if (response.data.features === undefined || response.data.features[0] === undefined) {
    throw new Error('Unable to determine location');
  }

  let cityJson = response.data.features[0];
  let address = cityJson.properties.address;
  let name = cityJson.properties.name;
  let country = address.country;

  // Extract region
  let region = extractRegionFromOSM(address);

  return {
    name: name,
    region: region,
    country: country,
    longitude: lon,
    latitude: lat,
  };
}

export async function getCityFromCoordsOWM(longitude: number, latitude: number): Promise<string> {
  const response = await axios.get(OWM_SEARCH_URL, {
    params: {
      appid: Config.OWM_API_KEY,
      limit: 1,
      lon: longitude,
      lat: latitude,
    },
  });

  const cityObj = response.data[0];
  const cityName = cityObj.local_names.ru as string;

  return cityName;
}

export function filterCitiesByQuery(cities: FoundCity[], query: string) {
  query = query.trim().toLowerCase();

  return cities.filter((city) =>
    city.name.toLowerCase().indexOf(query) >= 0
  );
}

export function getReadableCountry(city: FoundCity | SavedCity): string {
  if (city.region.length > 0) {
    return `${city.region}, ${city.country}`;
  } else {
    return city.country;
  }
}
