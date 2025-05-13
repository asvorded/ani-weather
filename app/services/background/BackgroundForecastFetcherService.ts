import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

import { WidgetService } from '../WidgetService';
import { ShortForecast } from '../../types/widgets/ShortForecast';
import { SavedCitiesService } from '../SavedCitiesService';

export const BACKGROUND_WEATHER_FETCH_TASK = 'BACKGROUND_WEATHER_FETCH_TASK';
export const BACKGROUND_WEATHER_FETCH_INTERVAL = 60;

export function defineWeatherFetchTask() {
  TaskManager.defineTask(BACKGROUND_WEATHER_FETCH_TASK, async () => {
    console.log(`${BACKGROUND_WEATHER_FETCH_TASK} started`);

    try {
      let forecastToShow: ShortForecast | undefined;

      const geoCity = await SavedCitiesService.updateGeolocationForecast();
      if (geoCity !== null) {
        forecastToShow = {
          name: geoCity.savedCity.name,
          state: geoCity.forecast.state,
          currentTemp: geoCity.forecast.currentTemp,
          minTemp: geoCity.forecast.minTemp,
          maxTemp: geoCity.forecast.maxTemp,
          time: geoCity.forecast.lastUpdated + geoCity.forecast.timezone,
        };
      } else {
        let savedCity = (await SavedCitiesService.getAllSavedCities())[0];
        if (savedCity !== undefined && savedCity !== null) {
          const newForecast = await SavedCitiesService.updateForecastByCoords(savedCity.savedCity.coords);
          forecastToShow = {
            name: savedCity.savedCity.name,
            state: newForecast.forecast.state,
            currentTemp: newForecast.forecast.currentTemp,
            minTemp: newForecast.forecast.minTemp,
            maxTemp: newForecast.forecast.maxTemp,
            time: newForecast.forecast.lastUpdated + newForecast.forecast.timezone,
          };
        }
      }

      if (forecastToShow !== undefined) {
        WidgetService.setForecastOnWidget(forecastToShow);
      }

      console.log(`${BACKGROUND_WEATHER_FETCH_TASK} finished successfully`);
      return BackgroundTask.BackgroundTaskResult.Success;
    } catch (e: any) {
      console.error(`${BACKGROUND_WEATHER_FETCH_TASK} failed: ${e.message}`);
    }
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
