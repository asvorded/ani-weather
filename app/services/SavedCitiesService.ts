import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyValuePair } from '@react-native-async-storage/async-storage/lib/typescript/types';

import { Coords } from '../types/common/Coords';
import { SavedCity } from '../types/storage/SavedCity';
import { SavedCityWithForecast } from '../types/storage/SavedCityWithForecast';
import { SavedForecast, SavedForecastWithCityCoords } from '../types/storage/SavedForecast';
import { FoundCity } from '../types/api/FoundCity';
import WeatherService from './WeatherService';
import { Forecast } from '../types/api/Forecast';

class SavedForecastsService {
  private static forecastsStorageIdPrefix = 'forecasts-';
  private static forecastsStorageIdsKey = 'forecasts-ids';
  private static geolocationForecastKey = 'geo-forecast';

  private static forecastNotFoundBySavedKeyErrMsg = 'Invalid async-storage key-value structure: saved forecast with saved id not found.';

  private static getCoordsString(coords: Coords): string {
    return `${coords.lat}-${coords.long}`;
  }

  private static getSavedForecastStorageId(coords: Coords): string {
    return `${SavedForecastsService.forecastsStorageIdPrefix}${SavedForecastsService.getCoordsString(coords)}`;
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
    const forecastsIdsStr = await AsyncStorage.getItem(SavedForecastsService.forecastsStorageIdsKey);

    const forecastsIds = forecastsIdsStr ? SavedForecastsService.parseSavedForecastsIdsJSON(forecastsIdsStr) : [] as string[];

    return forecastsIds;
  }

  private static async addForecastStorageId(coords: Coords) {
    const forecastsIds = await SavedForecastsService.getForecastsStorageIds();

    const newForecastsIds = [...forecastsIds, SavedForecastsService.getSavedForecastStorageId(coords)];

    await AsyncStorage.setItem(SavedForecastsService.forecastsStorageIdsKey, JSON.stringify(newForecastsIds));
  }

  private static async removeForecastStorageId(coords: Coords) {
    const forecastsIds = await SavedForecastsService.getForecastsStorageIds();

    const newCitiesIds = forecastsIds.filter(e => e !== SavedForecastsService.getSavedForecastStorageId(coords));

    await AsyncStorage.setItem(SavedForecastsService.forecastsStorageIdsKey, JSON.stringify(newCitiesIds));
  }

  static mapForecastToSavedForecast(forecast: Forecast): SavedForecast {
    return forecast as SavedForecast;
  }

  static async getSavedForecastByCoords(coords: Coords): Promise<SavedForecastWithCityCoords | null> {
    const savedForecastJSON = await AsyncStorage.getItem(SavedForecastsService.getSavedForecastStorageId(coords));

    const savedForecast = savedForecastJSON
      ? SavedForecastsService.parseSavedForecastJSON(savedForecastJSON)
      : null;

    return savedForecast;
  }

  static async getAllSavedForecasts(): Promise<SavedForecastWithCityCoords[]> {
    const forecastsIds = await SavedForecastsService.getForecastsStorageIds();

    const savedForecastsJSONs = SavedForecastsService.getValuesFromPairs(await AsyncStorage.multiGet(forecastsIds));

    if (savedForecastsJSONs.some(e => !e)) {
      throw new Error(SavedForecastsService.forecastNotFoundBySavedKeyErrMsg);
    }

    const savedForecasts = SavedForecastsService.parseSavedForecastsJSONs(savedForecastsJSONs.filter(e => e !== null));

    return savedForecasts;
  }

  static async removeForecastByCoords(coords: Coords): Promise<void> {
    await SavedForecastsService.removeForecastStorageId(coords);
    await AsyncStorage.removeItem(SavedForecastsService.getSavedForecastStorageId(coords));
  }

  static async addOrUpdateForecastByCoords(coords: Coords, forecastToSave: SavedForecast): Promise<SavedForecastWithCityCoords> {
    const forecastsIds = await SavedForecastsService.getForecastsStorageIds();

    const newForecastId = SavedForecastsService.getSavedForecastStorageId(coords);

    if (!forecastsIds.includes(newForecastId)) {
      SavedForecastsService.addForecastStorageId(coords);
    }

    const actualSavedForecast: SavedForecastWithCityCoords = {
      cityCoords: coords,
      forecast: forecastToSave,
    };

    await AsyncStorage.setItem(newForecastId, JSON.stringify(actualSavedForecast));

    return actualSavedForecast;
  }

  static async getGeolocationForecast(): Promise<SavedForecastWithCityCoords | null> {
    const geoForecastJSON = await AsyncStorage.getItem(SavedForecastsService.geolocationForecastKey);

    if (!geoForecastJSON) {
      return null;
    }

    const geoForecast = SavedForecastsService.parseSavedForecastJSON(geoForecastJSON);

    return geoForecast;
  }

  static async addOrUpdateGeolocationForecast(coords: Coords, forecastToSave: SavedForecast): Promise<SavedForecastWithCityCoords> {
    const actualSavedForecast: SavedForecastWithCityCoords = {
      cityCoords: coords,
      forecast: forecastToSave,
    };

    await AsyncStorage.setItem(SavedForecastsService.geolocationForecastKey, JSON.stringify(actualSavedForecast));

    return actualSavedForecast;
  }
}

export class SavedCitiesService {

  private static cityStorageIdPrefix = 'city-';
  private static citiesStorageIdsKey = 'cities-ids';
  private static geolocationCityKey = 'geo-city';

  private static cityNotFoundBySavedKeyErrMsg = 'Invalid async-storage key-value structure: saved city with saved id not found.';
  private static forecastNotFoundByCityErrMsg = 'Invalid async-storage key-value structure: saved forecast for existing city not found.';

  private static getCoordsString(coords: Coords): string {
    return `${coords.lat}-${coords.long}`;
  }

  private static areCoordsEqual(coords1: Coords, coords2: Coords) {
    return (coords1.lat === coords2.lat) && (coords1.long === coords2.long);
  }

  private static getSavedCityStorageId(coords: Coords): string {
    return `${SavedCitiesService.cityStorageIdPrefix}${SavedCitiesService.getCoordsString(coords)}`;
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

  private static toSavedCity(city: FoundCity): SavedCity {
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
      const foundForecast = forecasts.find(forecast => SavedCitiesService.areCoordsEqual(forecast.cityCoords, city.coords));

      if (!foundForecast) {
        throw new Error(SavedCitiesService.forecastNotFoundByCityErrMsg);
      }

      return {
        savedCity: city,
        forecast: foundForecast.forecast,
      };
    });
  }

  static async getCitiesStorageIds(): Promise<string[]> {
    const citiesIdsStr = await AsyncStorage.getItem(SavedCitiesService.citiesStorageIdsKey);

    const citiesIds = citiesIdsStr ? SavedCitiesService.parseCitiesIdsJSON(citiesIdsStr) : [] as string[];

    return citiesIds;
  }

  private static async addCityStorageId(coords: Coords): Promise<void> {
    const citiesIds = await SavedCitiesService.getCitiesStorageIds();

    const newCityId = SavedCitiesService.getSavedCityStorageId(coords);

    if (!citiesIds.includes(newCityId)) {
      const newCitiesIds = [...citiesIds, newCityId];
      await AsyncStorage.setItem(SavedCitiesService.citiesStorageIdsKey, JSON.stringify(newCitiesIds));
    }
  }

  private static async removeCityStorageId(coords: Coords): Promise<void> {
    const citiesIds = await SavedCitiesService.getCitiesStorageIds();

    const newCitiesIds = citiesIds.filter(e => e !== SavedCitiesService.getSavedCityStorageId(coords));

    await AsyncStorage.setItem(SavedCitiesService.citiesStorageIdsKey, JSON.stringify(newCitiesIds));
  }

  static async getAllSavedCities(): Promise<SavedCityWithForecast[]> {
    const citiesIds = await SavedCitiesService.getCitiesStorageIds();

    const savedCitiesJSONs = SavedCitiesService.getValuesFromPairs(await AsyncStorage.multiGet(citiesIds));

    if (savedCitiesJSONs.some(e => !e)) {
      throw new Error(SavedCitiesService.cityNotFoundBySavedKeyErrMsg);
    }

    const savedCities = SavedCitiesService.parseCitiesJSONs(savedCitiesJSONs.filter(e => e !== null));

    const savedForecasts = await SavedForecastsService.getAllSavedForecasts();

    const savedCitiesWithForecasts = SavedCitiesService.mergeCitiesAndForecasts(savedCities, savedForecasts);

    return savedCitiesWithForecasts;
  }

  static async addCity(city: FoundCity): Promise<SavedCityWithForecast> {
    const cityForSave = SavedCitiesService.toSavedCity(city);

    // Forecast should be updated first for data consistency purposes, as forecast update can throw network or other exceptions.
    const forecastObj = await SavedCitiesService.updateForecastByCoords(cityForSave.coords);

    await SavedCitiesService.addCityStorageId(cityForSave.coords);
    await AsyncStorage.setItem(SavedCitiesService.getSavedCityStorageId(cityForSave.coords), JSON.stringify(cityForSave));

    const cityWithForecast: SavedCityWithForecast = {
      forecast: forecastObj.forecast,
      savedCity: cityForSave,
    };

    return cityWithForecast;
  }

  static async removeCityByCoords(coords: Coords): Promise<void> {
    await SavedCitiesService.removeCityStorageId(coords);
    await AsyncStorage.removeItem(SavedCitiesService.getSavedCityStorageId(coords));

    await SavedForecastsService.removeForecastByCoords(coords);
  }

  static async updateForecastByCoords(coords: Coords): Promise<SavedForecastWithCityCoords> {
    const forecast = await WeatherService.fetchWeatherWithForecastByCoords(coords.lat, coords.long);

    const actualSavedForecast = await SavedForecastsService.addOrUpdateForecastByCoords(
      coords,
      SavedForecastsService.mapForecastToSavedForecast(forecast)
    );

    const savedForecastWithCityCoords: SavedForecastWithCityCoords = {
      cityCoords: coords,
      forecast: actualSavedForecast.forecast,
    };

    return savedForecastWithCityCoords;
  }

  private static async getGeolocationCityWithoutForecast(): Promise<SavedCity | null> {
    const geoCityJSON = await AsyncStorage.getItem(SavedCitiesService.geolocationCityKey);

    if (!geoCityJSON) {
      return null;
    }

    const geoCity = SavedCitiesService.parseCitiesJSONs([geoCityJSON])[0];

    return geoCity;
  }

  static async getGeolocationCity(): Promise<SavedCityWithForecast | null> {
    const geoCity = await SavedCitiesService.getGeolocationCityWithoutForecast();

    if (!geoCity) {
      return null;
    }

    const geoForecastWithCoords = await SavedForecastsService.getGeolocationForecast();

    if (!geoForecastWithCoords || !SavedCitiesService.areCoordsEqual(geoForecastWithCoords.cityCoords, geoCity.coords)) {
      return null;
    }

    return {
      savedCity: geoCity,
      forecast: geoForecastWithCoords.forecast,
    };
  }

  static async updateGeolocationForecast(): Promise<SavedCityWithForecast> {
    const geoCity = await SavedCitiesService.getGeolocationCityWithoutForecast();

    if (!geoCity) {
      throw new Error('updateGeolocationForecast invalid usage: called when no location is saved');
    }

    const coords = geoCity.coords;

    const forecast = await WeatherService.fetchWeatherWithForecastByCoords(coords.lat, coords.long);

    const savedForecastWithCityCoords = await SavedForecastsService.addOrUpdateGeolocationForecast(coords, forecast);

    const savedCityWithForecast: SavedCityWithForecast = {
      savedCity: geoCity,
      forecast: savedForecastWithCityCoords.forecast,
    };

    return savedCityWithForecast;
  }

  static async updateGeolocationCity(city: FoundCity): Promise<SavedCityWithForecast> {
    const geoCityForSave = SavedCitiesService.toSavedCity(city);
    geoCityForSave.isGeolocation = true;
    const coords = geoCityForSave.coords;

    const forecast = await WeatherService.fetchWeatherWithForecastByCoords(coords.lat, coords.long);

    await AsyncStorage.setItem(SavedCitiesService.geolocationCityKey, JSON.stringify(geoCityForSave));
    const savedForecastWithCityCoords = await SavedForecastsService.addOrUpdateGeolocationForecast(coords, forecast);

    const savedCityWithForecast: SavedCityWithForecast = {
      savedCity: geoCityForSave,
      forecast: savedForecastWithCityCoords.forecast,
    };

    return savedCityWithForecast;
  }
}
