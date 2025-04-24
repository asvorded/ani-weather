import { City } from '../types/api/City';

const popularCities: City[] = [
  {
    id: 0,
    name: 'Минск',
    country: 'Беларусь',
    longitude: 0,
    latitide: 0,
  },
  {
    id: 1,
    name: 'Кировск',
    country: 'Беларусь',
    longitude: 0,
    latitide: 0,
  },
  {
    id: 2,
    name: 'Могилев',
    country: 'Беларусь',
    longitude: 0,
    latitide: 0,
  },
  {
    id: 3,
    name: 'Новополоцк',
    country: 'Беларусь',
    longitude: 0,
    latitide: 0,
  },
  {
    id: 4,
    name: 'Бобруйск',
    country: 'Беларусь',
    longitude: 0,
    latitide: 0,
  },
  {
    id: 5,
    name: 'Витебск',
    country: 'Беларусь',
    longitude: 0,
    latitide: 0,
  },
  {
    id: 6,
    name: 'Полоцк',
    country: 'Беларусь',
    longitude: 0,
    latitide: 0,
  },
];

export async function getPopularCitiesAsync(): Promise<City[]> {
  // Wait 2 seconds
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  return popularCities;
}

export async function findCitiesAsync(query: string) {
  // wait 1 second
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  return filterCitiesByQuery(popularCities, query);
}

export function filterCitiesByQuery(cities: City[], query: string) {
  query = query.trim().toLowerCase();

  return cities.filter((city) =>
    city.name.toLowerCase().indexOf(query) >= 0
  );
}
