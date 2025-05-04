import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useCustomNavigation} from '../../hooks/useCustomNavigation.ts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SystemBars} from 'react-native-edge-to-edge';
import {Picker} from '@react-native-picker/picker';
import {PressureUnits, TempUnits} from '../../types/api/Forecast.ts';
import {Languages} from '../../types/storage/Languages.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserSettings} from '../../types/storage/UserSettings.ts';

const SettingsPage = () => {
  const {t, i18n} = useTranslation();
  const navigation = useCustomNavigation();
  const [settings, setSettings] = useState<UserSettings>({
    language: Languages.Russian,
    temperature: TempUnits.Celsius,
    pressure: PressureUnits.Pascal,
    notifications: false,
  });
  const saveSettings = useCallback(
    async (newSettings: UserSettings) => {
      try {
        console.log(settings);
        await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
        await i18n.changeLanguage(newSettings.language); // Ensure new language is applied
        console.log('Settings saved successfully:', newSettings);
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    },
    [i18n, settings],
  );
  const loadSettings = useCallback(async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);
  useEffect(() => {
    saveSettings(settings);
  }, [saveSettings, settings]);
  function setLanguage(value: Languages) {
    const updatedSettings = {...settings, language: value};
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  }

  function setTemperatureUnits(value: TempUnits) {
    const updatedSettings = {...settings, temperature: value};
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  }

  function setPressureUnits(value: PressureUnits) {
    const updatedSettings = {...settings, pressure: value};
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  }

  function setNotifications(value: boolean) {
    const updatedSettings = {...settings, notifications: value};
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
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
        <Text style={styles.header}>Settings</Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Language</Text>
          <Picker
            selectedValue={settings.language}
            mode="dropdown"
            style={styles.picker}
            onValueChange={value => setLanguage(value)}>
            <Picker.Item label="English" value={Languages.English} />
            <Picker.Item label="Русский" value={Languages.Russian} />
          </Picker>
        </View>

        {/* Measurement Units */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Units of Measurement</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Temperature</Text>
          <Picker
            selectedValue={settings.temperature}
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
          <Text style={styles.settingLabel}>Pressure</Text>
          <Picker
            selectedValue={settings.pressure}
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

        {/* Notifications */}
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Switch
            value={settings.notifications}
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
