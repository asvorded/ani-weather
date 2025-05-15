import React, {useState} from 'react';
import {
  View,
  Switch,
  ImageBackground,
  ScrollView, TouchableOpacity,
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
import {useTheme} from '../../hooks/useTheme.tsx';
import BackImg from '../../../assets/icons/back-custom.svg';
import {useCustomNavigation} from '../../hooks/useCustomNavigation.ts';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

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
const tempOptions = ['Celsius', 'Fahrenheit', 'Kelvin'];
const tempUnitsOptions = [TempUnits.Celsius, TempUnits.Fahrenheit, TempUnits.Kelvin];
const pressureOptions = ['Pascals', 'Millimeters of Mercury'];
const pressureUnitsOptions = [PressureUnits.Pascal, PressureUnits.MmHg];
const windSpeedOptions = ['M/s', 'Km/s'];
const windSpeedUnitsOptions = [WindSpeedUnits.Ms, WindSpeedUnits.Kmh];
const SettingsPage = () => {
  const {userSettings, setUserSettings} = useUserSettings();
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const {currentTheme, toggleTheme} = useTheme();
  const navigation = useCustomNavigation();
  const [selectedTempIndex, setSelectedTempIndex] = useState(tempUnitsOptions.indexOf(userSettings.temperature));
  const [selectedPressureIndex, setSelectedPressureIndex] = useState(pressureUnitsOptions.indexOf(userSettings.pressure));
  const [selectedWindSpeedIndex, setSelectedWindSpeedIndex] = useState(windSpeedUnitsOptions.indexOf(userSettings.windSpeed));
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

  function setTheme(value: boolean) {
    toggleTheme();
  }

  return (
    <ImageBackground
      style={styles.background}
      source={require('../../../assets/images/sample.png')}>
      <ScrollView
        style={
          {
            marginTop: insets.top,
            marginBottom: insets.bottom,
            marginLeft: insets.left,
            marginRight: insets.right,
          }
        }
        contentContainerStyle={[
          {
            paddingHorizontal: 15,
            paddingTop: 8,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <SystemBars style="light" />
        <View style={styles.headerContainer}>
          <TouchableOpacity key="back" style={styles.backButton} onPress={() => { navigation.goBack(); }}>
            <BackImg width={36} height={36} color={'#4b77d1'}/>
          </TouchableOpacity>
          <CustomText style={styles.header}>{t('settings.title')}</CustomText>
        </View>

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
            <SegmentedControl
              values={tempOptions}
              selectedIndex={selectedTempIndex}
              style={styles.picker}
              fontStyle={styles.pickerItemText}
              onChange={(event) => {
                setSelectedTempIndex(event.nativeEvent.selectedSegmentIndex);
                setTemperatureUnits(tempUnitsOptions[event.nativeEvent.selectedSegmentIndex]);
              }}
              appearance={'light'}
            />
          }
        />

        <SettingsPanel
          color="#FFE179"
          title={t('settings.units.pressure')}
          contentElement={
            <SegmentedControl
              values={pressureOptions}
              selectedIndex={selectedPressureIndex}
              style={styles.picker}
              fontStyle={styles.pickerItemText}
              onChange={(event) => {
                setSelectedPressureIndex(event.nativeEvent.selectedSegmentIndex);
                setPressureUnits(
                  pressureUnitsOptions[event.nativeEvent.selectedSegmentIndex],
                );
              }}
              appearance={'light'}
            />
          }
        />

        <SettingsPanel
          color="#FBB9BA"
          title={t('settings.units.wind')}
          contentElement={
            <SegmentedControl
              values={windSpeedOptions}
              selectedIndex={selectedWindSpeedIndex}
              style={styles.picker}
              fontStyle={styles.pickerItemText}
              onChange={(event) => {
                setSelectedWindSpeedIndex(event.nativeEvent.selectedSegmentIndex);
                setWindSpeedUnits(
                  windSpeedUnitsOptions[event.nativeEvent.selectedSegmentIndex],
                );
              }}
              appearance={'light'}
            />
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

