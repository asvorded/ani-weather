import { WeatherModule } from '../../specs/NativeModules';
import { SavedCityWithForecast } from '../types/storage/SavedCityWithForecast';
import { SavedForecastWithCityCoords } from '../types/storage/SavedForecast';
import { ShortForecast } from '../types/widgets/ShortForecast';
import { SavedCitiesService } from './SavedCitiesService';

export const WIDGET_INIT_TASK_NAME = 'widget-init';

export async function widgetInit() {
  try {
    // Try set location forecast
    let geoCity: SavedCityWithForecast | null;
    try {
      geoCity = await SavedCitiesService.updateGeolocationForecast();
    } catch {
      geoCity = null;
    }

    if (geoCity === null) {
      geoCity = await SavedCitiesService.getGeolocationCity();
    }
    if (geoCity !== null) {
      WidgetService.setForecastOnWidget({
        name: geoCity.savedCity.name,
        state: geoCity.forecast.state,
        currentTemp: geoCity.forecast.currentTemp,
        minTemp: geoCity.forecast.minTemp,
        maxTemp: geoCity.forecast.maxTemp,
        time: geoCity.forecast.lastUpdated + geoCity.forecast.timezone,
      });
    } else {
      // Try get first saved city
      const savedCities = await SavedCitiesService.getAllSavedCities();
      if (savedCities.length > 0) {
        const savedCity = savedCities[0];

        // Try update forecast
        let newForecast: SavedForecastWithCityCoords | null;
        try {
          newForecast = await SavedCitiesService.updateForecastByCoords(savedCity.savedCity.coords);
        } catch {
          newForecast = null;
        }

        if (newForecast !== null) {
          WidgetService.setForecastOnWidget({
            name: savedCity.savedCity.name,
            state: newForecast.forecast.state,
            currentTemp: newForecast.forecast.currentTemp,
            minTemp: newForecast.forecast.minTemp,
            maxTemp: newForecast.forecast.maxTemp,
            time: newForecast.forecast.lastUpdated + newForecast.forecast.timezone,
          });
        } else {
          WidgetService.setForecastOnWidget({
            name: savedCity.savedCity.name,
            state: savedCity.forecast.state,
            currentTemp: savedCity.forecast.currentTemp,
            minTemp: savedCity.forecast.minTemp,
            maxTemp: savedCity.forecast.maxTemp,
            time: savedCity.forecast.lastUpdated + savedCity.forecast.timezone,
          });
        }
      }
    }
  } catch (e: any) {
    console.error(`Widget initialization failed: ${e.message}`);
  }
}

export namespace WidgetService {
  export function setForecastOnWidget(forecast: ShortForecast) {
    WeatherModule.setForecastOnWidget(forecast);
  }

  export function resetWidget() {
    WeatherModule.resetWidget();
  }
}
