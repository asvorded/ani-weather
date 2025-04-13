/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import Geolocation from '@react-native-community/geolocation';
import React, { useState } from 'react';
import {
  Text,
} from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TownSelect from './TownSelect';

const App = () => {
  return (
    <SafeAreaProvider>
      <SystemBars style='auto'/>
      <SafeAreaView>
        <TownSelect/>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default App;
