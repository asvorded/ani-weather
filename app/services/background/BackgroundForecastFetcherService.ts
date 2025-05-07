import * as BackgroundTask from 'expo-background-task';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import * as WeatherService from '../WeatherService';
import { ShortForecast } from '../../types/widgets/ShortForecast';

import { WeatherModule } from '../../../specs/NativeModules';

export const BACKGROUND_WEATHER_FETCH_TASK = 'BACKGROUND_WEATHER_FETCH_TASK';
export const BACKGROUND_WEATHER_FETCH_INTERVAL = 15;

export function defineWeatherFetchTask() {
  // TODO: Support for iOS

  TaskManager.defineTask(BACKGROUND_WEATHER_FETCH_TASK, async () => {
    console.log(`${BACKGROUND_WEATHER_FETCH_TASK} started`);

    // Get last chosen or favourite city
    // TODO: get city from SavedCitiesService

    const testForecast: ShortForecast = {
      name: 'Test',
      state: -1,
      currentTemp: Math.random() * 50,
      minTemp: -10,
      maxTemp: 10,
    };
    WeatherModule.setForecastOnWidget(testForecast);

    console.log(`${BACKGROUND_WEATHER_FETCH_TASK} finished`);
    return BackgroundFetch.BackgroundFetchResult.NewData;
  });
}

export function registerWeatherFetchTask() {
  try {
    BackgroundTask.registerTaskAsync(BACKGROUND_WEATHER_FETCH_TASK, {
      minimumInterval: BACKGROUND_WEATHER_FETCH_INTERVAL,
    });
    console.log(`${BACKGROUND_WEATHER_FETCH_TASK} registered`);
  } catch (e: any) {
    console.error(`${BACKGROUND_WEATHER_FETCH_TASK} failed to register: ${JSON.stringify(e)}`);
  }
}

export function unregisterWeatherFetchTask() {
  try {
    BackgroundTask.unregisterTaskAsync(BACKGROUND_WEATHER_FETCH_TASK);
    console.log(`${BACKGROUND_WEATHER_FETCH_TASK} unregistered`);
  } catch (e: any) {
    console.error(`${BACKGROUND_WEATHER_FETCH_TASK} failed to unregister: ${JSON.stringify(e)}`);
  }
}
