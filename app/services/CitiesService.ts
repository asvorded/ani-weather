import axios from 'axios';
import Config from 'react-native-config';

import { FoundCity } from '../types/api/FoundCity';

const OSMSearchUrl: string = 'https://nominatim.openstreetmap.org/search';
const OWMSearchUrl: string = 'http://api.openweathermap.org/geo/1.0/direct';

// TODO: remove export
export const popularCities: FoundCity[] = [
  {
    name: 'Минск',
    region: 'Минская область',
    country: 'Беларусь',
    longitude: 27.5618225,
    latitude: 53.9024716,
  },
  {
    name: 'Кировск',
    region: 'Могилевская область',
    country: 'Беларусь',
    longitude: 29.4716,
    latitude: 53.27022,
  },
  {
    name: 'Могилев',
    region: 'Могилевская область',
    country: 'Беларусь',
    longitude: 30.3429838,
    latitude: 53.9090245,
  },
];

export function getPopularCities(): FoundCity[] {
  return popularCities;
}

let inputTimeout: NodeJS.Timeout | null = null;

export function findCitiesWithTimeout(
  query: string,
  callback: (cities: FoundCity[]) => void
) {
  if (inputTimeout) {
    clearTimeout(inputTimeout);
  }

  inputTimeout = setTimeout(() => {
    findCitiesOSMAsync(query).then(callback);
  }, 500);
}

export async function findCitiesOSMAsync(query: string): Promise<FoundCity[]> {
  // Potential exception ignored beacuse there is no need to handle it
  let response = await axios.get(OSMSearchUrl, {
    params: {
      city: query,
      countrycodes: 'by',
      format: 'geojson',
      featureType: 'settlement',
      addressdetails: 1,
    },
    headers: {
      'Accept-Language': 'ru', // TODO: Language according to locale
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
    let region = '';
    let end = Object.keys(cityJson.properties.address).indexOf('ISO3166-2-lvl4');
    if (end > 1) {
      region = Object.values(cityJson.properties.address)
        .slice(1, end)
        .join(', ');
    }

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
  let response = await axios.get(OWMSearchUrl, {
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

export function filterCitiesByQuery(cities: FoundCity[], query: string) {
  query = query.trim().toLowerCase();

  return cities.filter((city) =>
    city.name.toLowerCase().indexOf(query) >= 0
  );
}

export function getReadableCountry(city: FoundCity): string {
  if (city.region.length > 0) {
    return `${city.region}, ${city.country}`;
  } else {
    return city.country;
  }
}

export async function getCityNameByCoordinates(longitude: number, latitude: number): Promise<string> {
  const response = await axios.get(OWMSearchUrl, {
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
