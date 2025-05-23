import React, {StrictMode} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useFonts} from 'expo-font';
import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import TownSelect from './pages/TownSelect/TownSelect.page';
import HomePage from './pages/Home/Home.page';
import MeteoChannel from './pages/MeteoChannel/MeteoChannel.page';
import SettingsPage from './pages/Settings/Settings.page.tsx';

import {
  PagesNames,
  RootStackParamsList,
} from './types/common/root-stack-params-list';
import {UserSettingsProvider} from './services/UserSettingsProvider.tsx';
import { SavedCitiesProvider } from './hooks/useSavedCities.tsx';
import { useSavedCities } from './hooks/useSavedCities.tsx';
import {ThemeProvider} from './hooks/useTheme.tsx';
import AnimatedBackground from './components/AnimatedBackground/AnimatedBackgroundImage.tsx';
import {BackgroundProvider} from './hooks/useAnimatedBackground.tsx';
import {WeatherThemeProvider} from './hooks/useWeatherTheme.tsx';

const RootStack = createNativeStackNavigator<RootStackParamsList>({
  //initialRouteName: PagesNames.Home,
  screenOptions: {
    headerShown: false,
    animation: 'simple_push',
  },
  screens: {
    [PagesNames.Home]: HomePage,
    [PagesNames.TownSelect]: TownSelect,
    [PagesNames.MeteoChannel]: MeteoChannel,
    [PagesNames.Settings]: SettingsPage,
  },
});

const Navigation = createStaticNavigation(RootStack);

const InternalApp = () => {
  const {ready} = useSavedCities();

  return ready ? (
    <Navigation />
  ) : null;
};

const App = () => {
  useFonts({
    'BellotaText-Regular': require('./../assets/fonts/BellotaText-Regular.ttf'),
  });

  return (
    // BUG: Strict mode breaks fetch functions' logic (wtf)
    <>
      <SafeAreaProvider>
        <ThemeProvider>
          <WeatherThemeProvider theme={0}>
            <UserSettingsProvider>
              <SavedCitiesProvider>
                <BackgroundProvider initialBackground={require('../assets/images/backgrounds/background-light.jpg')}>
                  <InternalApp />
                </BackgroundProvider>
              </SavedCitiesProvider>
            </UserSettingsProvider>
          </WeatherThemeProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </>
  );
};

export default App;
