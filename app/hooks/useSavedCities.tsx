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

  const updateAllCities = React.useCallback(async () => {
    const [savedCities, geoCity] = await Promise.all([
      SavedCitiesService.getAllSavedCities(),
      SavedCitiesService.getGeolocationCity(),
    ]);
    if (geoCity !== null) {
      WidgetService.setForecastOnWidget({
        name: geoCity.savedCity.name,
        state: geoCity.forecast.state,
        currentTemp: geoCity.forecast.currentTemp,
        minTemp: geoCity.forecast.minTemp,
        maxTemp: geoCity.forecast.maxTemp,
        time: geoCity.forecast.lastUpdated + geoCity.forecast.timezone,
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
          time: cityToShow.forecast.lastUpdated + cityToShow.forecast.timezone,
        });
      } else {
        WidgetService.resetWidget();
      }

      setSavedCities(savedCities);
    }
  }, []);

  const addCity = React.useCallback(
    async (foundCity: FoundCity) => {
      await SavedCitiesService.addCity(foundCity);
      await updateAllCities();
    },
    [updateAllCities],
  );

  const removeCity = React.useCallback(
    async (city: SavedCity) => {
      await SavedCitiesService.removeCityByCoords(city.coords);
      await updateAllCities();
    },
    [updateAllCities],
  );

  const updateCityForecast = React.useCallback(
    async (city: SavedCityWithForecast) => {
      await SavedCitiesService.updateForecastByCoords(city.savedCity.coords);
      await updateAllCities();
    },
    [updateAllCities],
  );

  const updateGeolocationCity = React.useCallback(
    async (city: FoundCity) => {
      await SavedCitiesService.updateGeolocationCity(city);
      await updateAllCities();
    },
    [updateAllCities],
  );

  const updateGeolocationForecast = React.useCallback(async () => {
    console.log('updateGeolocationForecast in useSavedCities called');
    await SavedCitiesService.updateGeolocationForecast();
    await updateAllCities();
  }, [updateAllCities]);

  // Initialize cities
  useEffect(() => {
    updateAllCities().then(() => {
      setReady(true);
    });
  }, [updateAllCities]);

  return (
    <SavedCitiesContext.Provider value={React.useMemo(() => ({
      savedCities,
      ready,
      service: {
        addCity,
        removeCity,
        updateCityForecast,
        updateGeolocationCity,
        updateExistingGeolocationForecast: updateGeolocationForecast,
      },
    }), [savedCities, ready, addCity, removeCity, updateCityForecast, updateGeolocationCity, updateGeolocationForecast])}>
      {children}
    </SavedCitiesContext.Provider>
  );

};
