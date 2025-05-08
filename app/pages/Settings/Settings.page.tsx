import React from 'react';
import {
  View,
  Switch,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SystemBars} from 'react-native-edge-to-edge';
import {Picker} from '@react-native-picker/picker';
import {
  PressureUnits,
  TempUnits,
  WindSpeedUnits,
} from '../../types/api/Forecast.ts';
import {Languages} from '../../types/storage/Languages.ts';
import {useUserSettings} from '../../services/UserSettingsProvider.tsx';
import {CustomText} from '../../components/CustomText/CustomText.tsx';
import {styles} from './Settings.styles.ts';

type SettingsPanelProps = {
  color: string;
  title: string;
  contentElement: React.ReactNode;
};

const SettingsPanel = ({color, title, contentElement}: SettingsPanelProps) => {
  return (
    <View style={[styles.settingsPanel, {backgroundColor: color + 'C0'}]}>
      <CustomText style={styles.settingLabel}>{title}</CustomText>
      {contentElement}
    </View>
  );
};
const SettingsPage = () => {
  const {userSettings, setUserSettings} = useUserSettings();
  const {t} = useTranslation();
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
    <ImageBackground
      style={styles.background}
      source={require('../../../assets/images/sample.png')}>
      <ScrollView
        contentContainerStyle={{
          marginTop: insets.top,
          marginBottom: insets.bottom,
          marginLeft: insets.left,
          marginRight: insets.right,
          padding: 16,
        }}
        showsVerticalScrollIndicator={false}>
        <SystemBars style="light" />
        <CustomText style={styles.header}>{t('settings.title')}</CustomText>

        <SettingsPanel
          color="#A9E788"
          title={t('settings.language')}
          contentElement={
            <Picker
              selectedValue={userSettings.language}
              mode="dropdown"
              style={styles.picker}
              itemStyle={[styles.pickerItem]}
              onValueChange={value => setLanguage(value)}>
              <Picker.Item
                style={styles.text}
                label="English"
                value={Languages.English}
              />
              <Picker.Item
                style={styles.text}
                label="Русский"
                value={Languages.Russian}
              />
            </Picker>
          }
        />

        <SettingsPanel
          color="#B3DBFF"
          title={t('settings.units.temperature')}
          contentElement={
            <Picker
              selectedValue={userSettings.temperature}
              style={styles.picker}
              mode="dropdown"
              itemStyle={[styles.pickerItem]}
              onValueChange={value => setTemperatureUnits(value)}>
              <Picker.Item
                style={styles.text}
                label="Celsius"
                value={TempUnits.Celsius}
              />
              <Picker.Item
                style={styles.text}
                label="Fahrenheit"
                value={TempUnits.Fahrenheit}
              />
              <Picker.Item
                style={styles.text}
                label="Kelvin"
                value={TempUnits.Kelvin}
              />
            </Picker>
          }
        />

        <SettingsPanel
          color="#FFE179"
          title={t('settings.units.pressure')}
          contentElement={
            <Picker
              selectedValue={userSettings.pressure}
              style={[styles.text, styles.picker]}
              mode="dropdown"
              itemStyle={[styles.pickerItem]}
              onValueChange={value => setPressureUnits(value)}>
              <Picker.Item
                style={styles.text}
                label="Pascals"
                value={PressureUnits.Pascal}
              />
              <Picker.Item
                style={styles.text}
                label="Millimeters of Mercury"
                value={PressureUnits.MmHg}
              />
            </Picker>
          }
        />

        <SettingsPanel
          color="#FBB9BA"
          title={t('settings.units.wind')}
          contentElement={
            <Picker
              selectedValue={userSettings.windSpeed}
              style={styles.picker}
              mode="dropdown"
              itemStyle={[styles.pickerItem]}
              onValueChange={value => setWindSpeedUnits(value)}>
              <Picker.Item
                style={styles.text}
                label="M/s"
                value={WindSpeedUnits.Ms}
              />
              <Picker.Item
                label="Km/s"
                style={styles.text}
                value={WindSpeedUnits.Kmh}
              />
            </Picker>
          }
        />

        <SettingsPanel
          color="#FF9A79"
          title={t('settings.notifications')}
          contentElement={
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={userSettings.notifications ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              value={userSettings.notifications}
              onValueChange={value => setNotifications(value)}
            />
          }
        />
      </ScrollView>
    </ImageBackground>
  );
};

export default SettingsPage;

