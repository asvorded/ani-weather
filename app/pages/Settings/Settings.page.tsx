import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../hooks/useCustomNavigation.ts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SystemBars} from 'react-native-edge-to-edge';
import {Picker} from '@react-native-picker/picker';
import {
  PressureUnits,
  TempUnits,
  WindSpeedUnits,
} from '../../types/api/Forecast.ts';
import {Languages} from '../../types/storage/Languages.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserSettings} from '../../types/storage/UserSettings.ts';
import {useUserSettings} from '../../services/UserSettingsProvider.tsx';

const SettingsPage = () => {
  const {userSettings, setUserSettings} = useUserSettings();
  const {t, i18n} = useTranslation();
  const navigation = useCustomNavigation();
  const insets = useSafeAreaInsets();

  function setLanguage(value: Languages) {
    const updatedSettings = {...userSettings, language: value};
    setUserSettings(updatedSettings);
  }

  function setTemperatureUnits(value: TempUnits) {
    const updatedSettings = {...userSettings, temperature: value};
    setUserSettings(updatedSettings);
  }

  function setPressureUnits(value: PressureUnits) {
    const updatedSettings = {...userSettings, pressure: value};
    setUserSettings(updatedSettings);
  }

  function setWindSpeedUnits(value: WindSpeedUnits) {
    const updatedSettings = {...userSettings, windSpeed: value};
    setUserSettings(updatedSettings);
  }

  function setNotifications(value: boolean) {
    const updatedSettings = {...userSettings, notifications: value};
    setUserSettings(updatedSettings);
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: insets.top,
          marginBottom: insets.bottom,
          marginLeft: insets.left,
          marginRight: insets.right,
        }}>
        <SystemBars style="light" />
        <Text style={styles.header}>{t('settings.title')}</Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('settings.language')}</Text>
          <Picker
            selectedValue={userSettings.language}
            mode="dropdown"
            style={styles.picker}
            onValueChange={value => setLanguage(value)}>
            <Picker.Item label="English" value={Languages.English} />
            <Picker.Item label="Русский" value={Languages.Russian} />
          </Picker>
        </View>

        {/* Measurement Units */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('settings.units.title')}</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>
            {t('settings.units.temperature')}
          </Text>
          <Picker
            selectedValue={userSettings.temperature}
            style={styles.picker}
            mode="dropdown"
            itemStyle={{color: 'white'}}
            onValueChange={value => setTemperatureUnits(value)}>
            <Picker.Item label="Celsius" value={TempUnits.Celsius} />
            <Picker.Item label="Fahrenheit" value={TempUnits.Fahrenheit} />
            <Picker.Item label="Kelvin" value={TempUnits.Kelvin} />
          </Picker>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>
            {t('settings.units.pressure')}
          </Text>
          <Picker
            selectedValue={userSettings.pressure}
            style={styles.picker}
            mode="dropdown"
            itemStyle={{color: 'white'}}
            onValueChange={value => setPressureUnits(value)}>
            <Picker.Item label="Pascals" value={PressureUnits.Pascal} />
            <Picker.Item
              label="Millimeters of Mercury"
              value={PressureUnits.MmHg}
            />
          </Picker>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>
            {t('settings.units.wind')}
          </Text>
          <Picker
            selectedValue={userSettings.windSpeed}
            style={styles.picker}
            mode="dropdown"
            itemStyle={{color: 'white'}}
            onValueChange={value => setWindSpeedUnits(value)}>
            <Picker.Item label="M/s" value={WindSpeedUnits.Ms} />
            <Picker.Item
              label="Km/s"
              value={WindSpeedUnits.Kmh}
            />
          </Picker>
        </View>

        {/* Notifications */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>{t('settings.notifications')}</Text>
          <Switch
            value={userSettings.notifications}
            onValueChange={value => setNotifications(value)}
          />
        </View>
      </View>
    </View>
  );
};

export default SettingsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    //backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingItem: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 18,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#002081',
  },
});
