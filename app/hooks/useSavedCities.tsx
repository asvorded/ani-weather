import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { SavedCitiesService } from '../services/SavedCitiesService';
import { SavedCityWithForecast } from '../types/storage/SavedCityWithForecast';
import { FoundCity } from '../types/api/FoundCity';
import { SavedCity } from '../types/storage/SavedCity';
import { WidgetService } from '../services/WidgetService';

export interface ISavedCitiesService {
  addCity(foundCity: FoundCity): Promise<void>;

  removeCity(city: SavedCity): Promise<void>;

  updateCityForecast(city: SavedCityWithForecast): Promise<void>;

  updateExistingGeolocationForecast(): Promise<void>

  updateGeolocationCity(city: FoundCity): Promise<void>
}

interface ISavedCitiesState {
  readonly savedCities: SavedCityWithForecast[];
  readonly ready: boolean;
  readonly service: ISavedCitiesService;
}

const SavedCitiesContext = createContext<ISavedCitiesState | undefined>(undefined);

export const useSavedCities = () => {
  const context = useContext(SavedCitiesContext);
  if (context === undefined) {
    throw new Error('useSavedCities called outside provider component');
  }
  return context;
};

export const SavedCitiesProvider = ({children}: {children: ReactNode}) => {
  const [savedCities, setSavedCities] = useState<SavedCityWithForecast[]>([]);
  const [ready, setReady] = useState(false);

  async function updateAllCities() {
    const savedCities = await SavedCitiesService.getAllSavedCities();
    const geoCity = await SavedCitiesService.getGeolocationCity();
    if (geoCity !== null) {
      WidgetService.setForecastOnWidget({
        name: geoCity.savedCity.name,
        state: geoCity.forecast.state,
        currentTemp: geoCity.forecast.currentTemp,
        minTemp: geoCity.forecast.minTemp,
        maxTemp: geoCity.forecast.maxTemp,
      });

      setSavedCities([geoCity, ...savedCities]);
    } else {
      if (savedCities.length > 0) {
        const cityToShow = savedCities[0];
        WidgetService.setForecastOnWidget({
          name: cityToShow.savedCity.name,
          state: cityToShow.forecast.state,
          currentTemp: cityToShow.forecast.currentTemp,
          minTemp: cityToShow.forecast.minTemp,
          maxTemp: cityToShow.forecast.maxTemp,
        });
      } else {
        WidgetService.resetWidget();
      }

      setSavedCities(savedCities);
    }
  }

  async function addCity(foundCity: FoundCity) {
    await SavedCitiesService.addCity(foundCity);
    await updateAllCities();
  }

  async function removeCity(city: SavedCity) {
    await SavedCitiesService.removeCityByCoords(city.coords);
    await updateAllCities();
  }

  async function updateCityForecast(city: SavedCityWithForecast) {
    await SavedCitiesService.updateForecastByCoords(city.savedCity.coords);
    await updateAllCities();
  }

  async function updateGeolocationCity(city: FoundCity) {
    await SavedCitiesService.updateGeolocationCity(city);
    await updateAllCities();
  }

  async function updateGeolocationForecast() {
    await SavedCitiesService.updateGeolocationForecast();
    await updateAllCities();
  }

  // Initialize cities
  useEffect(() => {
    updateAllCities().then(() => {
      setReady(true);
    });
  }, []);

  return (
    <SavedCitiesContext.Provider value={{
      savedCities, ready,
      service: {
        addCity,
        removeCity,
        updateCityForecast,
        updateGeolocationCity,
        updateExistingGeolocationForecast: updateGeolocationForecast,
      },
    }}>
      {children}
    </SavedCitiesContext.Provider>
  );
};
