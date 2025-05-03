import React, { StrictMode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {useFonts} from 'expo-font';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TownSelect from './pages/TownSelect/TownSelect.page';
import HomePage from './pages/Home/Home.page';
import { PagesNames, RootStackParamsList } from './types/common/root-stack-params-list';
import MeteoChannel from './pages/MeteoChannel/MeteoChannel.page';

const RootStack = createNativeStackNavigator<RootStackParamsList>({
  initialRouteName: PagesNames.Home,
  screenOptions: {
    headerShown: false,
  },
  screens: {
    [PagesNames.Home]: HomePage,
    [PagesNames.TownSelect]: TownSelect,
    [PagesNames.MeteoChannel]: MeteoChannel,
  },
});

const Navigation = createStaticNavigation(RootStack);

const App = () => {
  useFonts({
    'BellotaText-Regular': require('./../assets/fonts/BellotaText-Regular.ttf'),
  });

  return (
    <StrictMode>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </StrictMode>
  );
};

export default App;
