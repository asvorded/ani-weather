import axios from 'axios';
import { City } from '../types/api/City';

const searchUrl: string = 'https://nominatim.openstreetmap.org/search';

const popularCities: City[] = [
  {
    name: 'Минск',
    region: 'Минская область',
    country: 'Беларусь',
    longitude: 27.5618225,
    latitide: 53.9024716,
  },
  {
    name: 'Кировск',
    region: 'Могилевская область',
    country: 'Беларусь',
    longitude: 29.4716,
    latitide: 53.27022,
  },
  {
    name: 'Могилев',
    region: 'Могилевская область',
    country: 'Беларусь',
    longitude: 30.3429838,
    latitide: 53.9090245,
  },
];

export async function getPopularCitiesAsync(): Promise<City[]> {
  return popularCities;
}

let inputTimeout: NodeJS.Timeout | null = null;

export function findCitiesWithTimeout(
  query: string,
  callback: (cities: City[]) => void
) {
  if (inputTimeout) {
    clearTimeout(inputTimeout);
  }

  inputTimeout = setTimeout(() => {
    findCitiesAsync(query).then(callback);
  }, 500);
}

export async function findCitiesAsync(query: string): Promise<City[]> {
  // Potential exception ignored beacuse there is no need to handle it
  let response = await axios.get(searchUrl, {
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
  return foundCities.map((cityJson): City => {
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
      latitide: lat,
    };
  });
}

export function filterCitiesByQuery(cities: City[], query: string) {
  query = query.trim().toLowerCase();

  return cities.filter((city) =>
    city.name.toLowerCase().indexOf(query) >= 0
  );
}

export function getReadableCountry(city: City): string {
  if (city.region.length > 0) {
    return `${city.region}, ${city.country}`;
  } else {
    return city.country;
  }
}
