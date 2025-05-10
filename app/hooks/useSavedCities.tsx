import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { SavedCityWithForecast } from '../types/storage/SavedCityWithForecast';
import { SavedCitiesService } from '../services/SavedCitiesService';

interface ISavedCitiesState {
  savedCities: SavedCityWithForecast[];
  //setSavedCities: React.Dispatch<SetStateAction<SavedCityWithForecast[]>>;
  ready: boolean;
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

  async function updateSavedCities(): Promise<void> {
    try {
      const savedCities = await SavedCitiesService.getAllSavedCities();
      setSavedCities(savedCities);
    } catch (e: any) {
      console.error(`Unable to get cities: ${JSON.stringify(e)}`);
    }
  }

  // Set up automatic update
  useEffect(() => {
    SavedCitiesService.addAddedListener(updateSavedCities);
    SavedCitiesService.addRemovedListener(updateSavedCities);

    return () => {
      SavedCitiesService.removeAddedListener(updateSavedCities);
      SavedCitiesService.removeRemovedListener(updateSavedCities);
    };
  }, []);

  // Initialize cities
  useEffect(() => {
    updateSavedCities().then(() => {
      setReady(true);
    });
  }, []);

  return (
    <SavedCitiesContext.Provider value={{savedCities, ready}}>
      {children}
    </SavedCitiesContext.Provider>
  );
};
