import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyValuePair } from '@react-native-async-storage/async-storage/lib/typescript/types';

import { Coords } from '../types/common/Coords';
import { SavedCity } from '../types/storage/SavedCity';


export class SavedCitiesService {

  private static cityStorageIdPrefix = 'city-';
  private static citiesStorageIdsKey = 'cities-ids';

  private static cityNotFoundBySavedKeyErrMsg = 'Invalid async-storage key-value structure: saved city with saved id not found.';

  private static getCoordsString(coords: Coords): string {
    return `${coords.lat}-${coords.long}`;
  }

  private static getSavedCityStorageId(coords: Coords): string {
    return `${this.cityStorageIdPrefix}${this.getCoordsString(coords)}`;
  }

  private static getValues(keyValuePairs: readonly KeyValuePair[]): (string | null)[] {
    return keyValuePairs.map(e => e[1]);
  }

  private static parseCitiesJSONs(jsons: string[]): SavedCity[] {
    return jsons.map(e => JSON.parse(e)) as SavedCity[];
  }

  static async getAllSavedCities(): Promise<SavedCity[]> {
    const citiesIdsStr = await AsyncStorage.getItem(this.citiesStorageIdsKey);

    const citiesIds = (citiesIdsStr ? JSON.parse(citiesIdsStr) : []) as string[];

    const savedCitiesJSONs = this.getValues(await AsyncStorage.multiGet(citiesIds));

    if (savedCitiesJSONs.some(e => !e)) {
      throw new Error(this.cityNotFoundBySavedKeyErrMsg);
    }

    const savedCities = this.parseCitiesJSONs(savedCitiesJSONs.filter(e => e !== null));

    return savedCities;
  }
}
