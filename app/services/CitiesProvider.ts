import { City } from '../types/api/City';

export {
  getPopularCitiesAsync,
  findCitiesAsync,
  cityQueryPredicate,
};

const cities: City[] = [
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

async function getPopularCitiesAsync(): Promise<City[]> {
  // Wait 2 seconds
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  return cities;
}

async function findCitiesAsync(query: string) {
  // wait 1 second
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  return cities.filter((city) =>
    cityQueryPredicate(city, query)
  );
}

function cityQueryPredicate(city: City, query: string) {
  return city.name.toUpperCase().indexOf(query.toUpperCase()) >= 0;
}
