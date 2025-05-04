import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyValuePair } from '@react-native-async-storage/async-storage/lib/typescript/types';

import { Coords } from '../types/common/Coords';
import { SavedCity } from '../types/storage/SavedCity';
import { SavedCityWithForecast } from '../types/storage/SavedCityWithForecast';
import { SavedForecast, SavedForecastWithCityCoords } from '../types/storage/SavedForecast';
import { City } from '../types/api/City';
import WeatherService from './WeatherService';
import { Forecast } from '../types/api/Forecast';

class SavedForecastsService {
  private static forecastsStorageIdPrefix = 'forecasts-';
  private static forecastsStorageIdsKey = 'forecasts-ids';

  private static forecastNotFoundBySavedKeyErrMsg = 'Invalid async-storage key-value structure: saved forecast with saved id not found.';

  private static getCoordsString(coords: Coords): string {
    return `${coords.lat}-${coords.long}`;
  }

  private static getSavedForecastStorageId(coords: Coords): string {
    return `${this.forecastsStorageIdPrefix}${this.getCoordsString(coords)}`;
  }

  private static getValuesFromPairs(keyValuePairs: readonly KeyValuePair[]): (string | null)[] {
    return keyValuePairs.map(e => e[1]);
  }

  private static parseSavedForecastJSON(json: string): SavedForecastWithCityCoords {
    return JSON.parse(json) as SavedForecastWithCityCoords;
  }

  private static parseSavedForecastsIdsJSON(json: string): string[] {
    return JSON.parse(json) as string[];
  }

  private static parseSavedForecastsJSONs(jsons: string[]): SavedForecastWithCityCoords[] {
    return jsons.map(e => JSON.parse(e)) as SavedForecastWithCityCoords[];
  }

  static async getForecastsStorageIds(): Promise<string[]> {
    const forecastsIdsStr = await AsyncStorage.getItem(this.forecastsStorageIdsKey);

    const forecastsIds = forecastsIdsStr ? this.parseSavedForecastsIdsJSON(forecastsIdsStr) : [] as string[];

    return forecastsIds;
  }

  private static async addForecastStorageId(coords: Coords) {
    const forecastsIds = await this.getForecastsStorageIds();

    const newForecastsIds = [...forecastsIds, this.getSavedForecastStorageId(coords)];

    await AsyncStorage.setItem(this.forecastsStorageIdsKey, JSON.stringify(newForecastsIds));
  }

  private static async removeForecastStorageId(coords: Coords) {
    const forecastsIds = await this.getForecastsStorageIds();

    const newCitiesIds = forecastsIds.filter(e => e !== this.getSavedForecastStorageId(coords));

    await AsyncStorage.setItem(this.forecastsStorageIdsKey, JSON.stringify(newCitiesIds));
  }

  static mapForecastToSavedForecast(forecast: Forecast): SavedForecast {
    return forecast as SavedForecast;
  }

  static async getSavedForecastByCoords(coords: Coords): Promise<SavedForecastWithCityCoords | null> {
    const savedForecastJSON = await AsyncStorage.getItem(this.getSavedForecastStorageId(coords));

    const savedForecast = savedForecastJSON
      ? this.parseSavedForecastJSON(savedForecastJSON)
      : null;

    return savedForecast;
  }

  static async getAllSavedForecasts(): Promise<SavedForecastWithCityCoords[]> {
    const forecastsIds = await this.getForecastsStorageIds();

    const savedForecastsJSONs = this.getValuesFromPairs(await AsyncStorage.multiGet(forecastsIds));

    if (savedForecastsJSONs.some(e => !e)) {
      throw new Error(this.forecastNotFoundBySavedKeyErrMsg);
    }

    const savedForecasts = this.parseSavedForecastsJSONs(savedForecastsJSONs.filter(e => e !== null));

    return savedForecasts;
  }

  static async removeForecastByCoords(coords: Coords): Promise<void> {
    await this.removeForecastStorageId(coords);
    await AsyncStorage.removeItem(this.getSavedForecastStorageId(coords));
  }

  static async addOrUpdateForecastByCoords(coords: Coords, forecastToSave: SavedForecast) {
    const forecastsIds = await this.getForecastsStorageIds();

    const newForecastId = this.getSavedForecastStorageId(coords);

    if (!forecastsIds.includes(newForecastId)) {
      this.addForecastStorageId(coords);
    }

    await AsyncStorage.setItem(newForecastId, JSON.stringify(forecastToSave));
  }
}

export class SavedCitiesService {

  private static cityStorageIdPrefix = 'city-';
  private static citiesStorageIdsKey = 'cities-ids';

  private static cityNotFoundBySavedKeyErrMsg = 'Invalid async-storage key-value structure: saved city with saved id not found.';

  private static getCoordsString(coords: Coords): string {
    return `${coords.lat}-${coords.long}`;
  }

  private static areCoordsEqual(coords1: Coords, coords2: Coords) {
    return (coords1.lat === coords2.lat) && (coords1.long === coords2.long);
  }

  private static getSavedCityStorageId(coords: Coords): string {
    return `${this.cityStorageIdPrefix}${this.getCoordsString(coords)}`;
  }

  private static getValuesFromPairs(keyValuePairs: readonly KeyValuePair[]): (string | null)[] {
    return keyValuePairs.map(e => e[1]);
  }

  private static parseCitiesJSONs(jsons: string[]): SavedCity[] {
    return jsons.map(e => JSON.parse(e)) as SavedCity[];
  }

  private static parseCitiesIdsJSON(json: string): string[] {
    return JSON.parse(json) as string[];
  }

  private static toSavedCity(city: City): SavedCity {
    return {
      name: city.name,
      country: city.country,
      region: city.region,
      coords: {
        lat: city.latitude,
        long: city.longitude,
      },
    };
  }

  private static mergeCitiesAndForecasts(cities: SavedCity[], forecasts: SavedForecastWithCityCoords[]): SavedCityWithForecast[] {
    return cities.map(city => {
      const foundForecast = forecasts.find(forecast => this.areCoordsEqual(forecast.cityCoords, city.coords));

      return {
        savedCity: city,
        forecast: foundForecast?.forecast,
      };
    });
  }

  static async getCitiesStorageIds(): Promise<string[]> {
    const citiesIdsStr = await AsyncStorage.getItem(this.citiesStorageIdsKey);

    const citiesIds = citiesIdsStr ? this.parseCitiesIdsJSON(citiesIdsStr) : [] as string[];

    return citiesIds;
  }

  private static async addCityStorageId(coords: Coords): Promise<void> {
    const citiesIds = await this.getCitiesStorageIds();

    const newCitiesIds = [...citiesIds, this.getSavedCityStorageId(coords)];

    await AsyncStorage.setItem(this.citiesStorageIdsKey, JSON.stringify(newCitiesIds));
  }

  private static async removeCityStorageId(coords: Coords): Promise<void> {
    const citiesIds = await this.getCitiesStorageIds();

    const newCitiesIds = citiesIds.filter(e => e !== this.getSavedCityStorageId(coords));

    await AsyncStorage.setItem(this.citiesStorageIdsKey, JSON.stringify(newCitiesIds));
  }

  static async getAllSavedCities(): Promise<SavedCityWithForecast[]> {
    const citiesIds = await this.getCitiesStorageIds();

    const savedCitiesJSONs = this.getValuesFromPairs(await AsyncStorage.multiGet(citiesIds));

    if (savedCitiesJSONs.some(e => !e)) {
      throw new Error(this.cityNotFoundBySavedKeyErrMsg);
    }

    const savedCities = this.parseCitiesJSONs(savedCitiesJSONs.filter(e => e !== null));

    const savedForecasts = await SavedForecastsService.getAllSavedForecasts();

    const savedCitiesWithForecasts = this.mergeCitiesAndForecasts(savedCities, savedForecasts);

    return savedCitiesWithForecasts;
  }

  static async addCity(city: City): Promise<SavedCity> {
    const cityForSave = this.toSavedCity(city);

    await this.addCityStorageId(cityForSave.coords);
    await AsyncStorage.setItem(this.getSavedCityStorageId(cityForSave.coords), JSON.stringify(cityForSave));

    return cityForSave;
  }

  static async removeCityByCoords(coords: Coords): Promise<void> {
    await this.removeCityStorageId(coords);
    await AsyncStorage.removeItem(this.getSavedCityStorageId(coords));

    await SavedForecastsService.removeForecastByCoords(coords);
  }

  static async updateForecastByCoords(coords: Coords): Promise<void> {
    const forecast = await WeatherService.fetchWeatherWithForecastByCoords(coords.lat, coords.long);

    await SavedForecastsService.addOrUpdateForecastByCoords(
      coords,
      SavedForecastsService.mapForecastToSavedForecast(forecast)
    );
  }
}
