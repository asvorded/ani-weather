/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SystemBars } from 'react-native-edge-to-edge';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TownSelect from './TownSelect';
import {useFonts} from 'expo-font';

const App = () => {
    useFonts({
        'BellotaText-Regular': require('./../assets/fonts/BellotaText-Regular.ttf'),
    });

  return (
    <SafeAreaProvider>
      <SystemBars style="auto"/>
      <SafeAreaView>
        <TownSelect/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
