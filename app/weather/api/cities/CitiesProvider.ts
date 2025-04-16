import { City } from '../../models/City';

export { getPopularCitiesAsync };

async function getPopularCitiesAsync(): Promise<City[]> {
  // Wait 2 seconds
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  return [
    {
      id: 0,
      name: 'Минск',
      longitude: 0,
      latitide: 0,
    },
    {
      id: 1,
      name: 'Кировск',
      longitude: 0,
      latitide: 0,
    },
    {
      id: 2,
      name: 'Могилев',
      longitude: 0,
      latitide: 0,
    },
    {
      id: 3,
      name: 'Новополоцк',
      longitude: 0,
      latitide: 0,
    },
    {
      id: 4,
      name: 'Бобруйск',
      longitude: 0,
      latitide: 0,
    },
    {
      id: 5,
      name: 'Витебск',
      longitude: 0,
      latitide: 0,
    },
  ];
}
