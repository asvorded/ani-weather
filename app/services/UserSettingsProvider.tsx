import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserSettings} from '../types/storage/UserSettings.ts';
import {Languages} from '../types/storage/Languages.ts';
import {PressureUnits, TempUnits, WindSpeedUnits} from '../types/api/Forecast.ts';
import {useTranslation} from 'react-i18next';





interface UserSettingsContextInterface {
  userSettings: UserSettings;
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

export const UserSettingsContext = createContext<UserSettingsContextInterface | undefined>(undefined);

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error('UserSettingsContext must be used within a UserSettingsProvider');
  }
  return context;
};
export const UserSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  let { t, i18n } = useTranslation();
  const [userSettings, setUserSettings] = useState<UserSettings>({
    language: Languages.Russian,
    temperature: TempUnits.Celsius,
    pressure: PressureUnits.Pascal,
    windSpeed: WindSpeedUnits.Ms,
    notifications: false,
  });
  useEffect(() => {
    (async () => {
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        setUserSettings(JSON.parse(savedSettings));
      }
    })();
  }, []);

  // Save settings when they change
  useEffect(() => {
    AsyncStorage.setItem('userSettings', JSON.stringify(userSettings));
    i18n.changeLanguage(userSettings.language);
  }, [userSettings, i18n]);
  return (
    <UserSettingsContext.Provider value={{userSettings, setUserSettings}}>
      {children}
    </UserSettingsContext.Provider>
  );
};
