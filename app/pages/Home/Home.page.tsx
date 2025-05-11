import { Button, ImageBackground, ScrollView, View } from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SystemBars } from 'react-native-edge-to-edge';

import { styles } from './Home.styles.ts';
import { CustomText } from '../../components/CustomText/CustomText.tsx';
import { HumidityProps, MagneticActivityProps, PressureProps,
  WeatherDetailedPanelProps, WindProps,
} from './Home.types.ts';
import { WeatherIcon } from '../../components/WeatherIcon/WeatherIcon.tsx';
import { WeatherIconType } from '../../components/WeatherIcon/WeatherIcon.types.ts';
import MagneticActivityImg from '../../../assets/images/magnet_activity_5.svg';
import WindCompassImg from '../../../assets/images/compass.svg';
import WindCompassArrowImg from '../../../assets/images/compass_arrow.svg';
import { PagesNames } from '../../types/common/root-stack-params-list.ts';
import { useCustomNavigation } from '../../hooks/useCustomNavigation.ts';
import { SavedCity } from '../../types/api/SavedCity.ts';
import { MoonPhases, PressureUnits, TempUnits, WindSpeedUnits } from '../../types/api/Forecast.ts';
import { getReadableGeomagneticDegreeId, getReadableHumidityId,
  getReadableMoonPhaseId, getReadablePressureId, getReadablePressureUnitsId,
  getReadableWindDirectionId, getReadableWindUnitsId,
} from './Home.utils.ts';
import * as citiesService from '../../services/CitiesService.ts';
import * as BacgroundService from '../../services/background/BackgroundForecastFetcherService.ts';

import {fetchWeatherByCoords} from '../../services/WeatherService.ts';
import {test} from '../../services/notifications/notifications.ts';
import { WidgetService } from '../../services/WidgetService.ts';

const WeatherDetailedPanel = ({
  color,
  title,
  text,
  contentElement,
}: WeatherDetailedPanelProps) => {
  return (
    <View style={styles.cell}>
      <View style={[styles.detailsPanel, { backgroundColor: color + 'C0' }]}>
        <View style={styles.detailsPanelContentWrapper}>
          {contentElement}
        </View>
        <View style={styles.detailsTextPanel}>
          <CustomText style={styles.detailsPanelTitle}>{title}</CustomText>
          <CustomText style={styles.detailsPanelText}>{text}</CustomText>
        </View>
      </View>
    </View>
  );
};

const WeatherPanel = () => {
  return (
    <View style={styles.topContainer}>
      <View style={styles.cityWrapper}>
        <CustomText style={styles.cityText}>#######</CustomText>
      </View>
      <View style={styles.weatherMainContainer}>
        <WeatherIcon type={WeatherIconType.PartlyCloudyDay} size={130} />
        <View />
        <CustomText style={styles.temperatureMain}>###</CustomText>
      </View>
      <View style={styles.weatherDescriptionContainer}>
        <CustomText style={styles.weatherDescriptionText}>#########</CustomText>
        <CustomText style={styles.temperatureAmplitudeText}>#########</CustomText>
      </View>
    </View>
  );
};

const MoonPhaseComponent = () => {
  return (
    <View style={styles.moonPhaseComponent} />
  );
};

const MagneticActivityComponent = ({
  degree,
}: MagneticActivityProps) => {
  return (
    <View style={styles.magneticActivityComponent}>
      <MagneticActivityImg height={65} width={65} />
      <CustomText style={styles.magneticActivityText}>{degree}</CustomText>
    </View>
  );
};

const HumidityComponent = ({
  humidity,
}: HumidityProps) => {
  return (
    <View style={styles.humidityComponent}>
      <CustomText style={styles.humidityText}>{`${humidity}%`}</CustomText>
    </View>
  );
};

const PressureComponent = ({
  pressure,
  units,
}: PressureProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.pressureComponent}>
      <CustomText style={styles.pressureText}>{pressure}</CustomText>
      <CustomText style={styles.pressureUnits}>
        {t(getReadablePressureUnitsId(units))}
      </CustomText>
    </View>
  );
};

const WindComponent = ({
  speed, units, directionAngle,
}: WindProps) => {
  return (
    <View style={styles.windComponent}>
      <WindCompassImg
        height={52}
        width={52}
        style={styles.windCompassImg}
      />
      <WindCompassArrowImg
        height={30}
        style={[styles.windCompassArrowImg, { transform: [{ rotate: `${directionAngle}deg` }] }]}
      />
    </View>
  );
};

const HomePage = () => {
  let { t } = useTranslation();
  const navigation = useCustomNavigation();

  const insets = useSafeAreaInsets();

  const [ testSavedCity, setSavedCities ] = useState({
    city: {
      name: 'тест',
      region: 'pdsfuhsdpfiu',
      country: 'Беларусь',
      longitude: 53,
      latitude: 27,
    },
    forecast: {
      currentTemp: 10,
      tempUnits: TempUnits.Celsius,
      state: -1,
      shortDescription: 'Солнышко',
      maxTemp: 12.5,
      minTemp: 8.3,
      moonPhase: MoonPhases.NewMoon,
      geomagneticActivity: 4,
      humidity: 78,
      pressure: 1014,
      pressureUnits: PressureUnits.Pascal,
      windSpeed: 8.5,
      windSpeedUnits: WindSpeedUnits.Ms,
      windDirectionAngle: 0,
      airQuality: 78,
      hourlyforecast: [
        { time: '12:00', state: -1, temp: 10.1 },
        { time: '12:00', state: -1,  temp: 10.1 },
        { time: '12:00', state: -1, temp: 10.1 },
      ],
    },
  });

  return (
    <View style={styles.outerContainer} key="home page">
      <SystemBars style="light"/>

      <ImageBackground
        style={styles.imageContainer}
        source={require('../../../assets/images/sample.png')}
      >
        <ScrollView
          style={{
            marginLeft: insets.left,
            marginRight: insets.right,
          }}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          //overScrollMode="never"
        >
          <WeatherPanel />
          <View style={styles.detailsGrid}>
            <View style={styles.row}>
              <WeatherDetailedPanel
                key="moon phase"
                color="#A9E788"
                title={t('forecast.moonPhase.main')}
                text={t(getReadableMoonPhaseId(testSavedCity.forecast.moonPhase))}
                contentElement={<MoonPhaseComponent />}
              />
              <WeatherDetailedPanel
                key="geomag"
                color="#B3DBFF"
                title={t('forecast.geomagnetic.main')}
                text={t(getReadableGeomagneticDegreeId(testSavedCity.forecast.geomagneticActivity))}
                contentElement={
                  <MagneticActivityComponent
                    degree={testSavedCity.forecast.geomagneticActivity}
                  />
                }
              />
            </View>
            <View style={styles.row}>
              <WeatherDetailedPanel
                key="humidity"
                color="#FFE179"
                title={t('forecast.humidity.main')}
                text={t(getReadableHumidityId(testSavedCity.forecast.humidity))}
                contentElement={
                  <HumidityComponent humidity={testSavedCity.forecast.humidity} />
                }
              />
              <WeatherDetailedPanel
                key="pressure"
                color="#FBB9BA"
                title={t('forecast.pressure.main')}
                text={t(getReadablePressureId(
                  testSavedCity.forecast.pressure,
                  testSavedCity.forecast.pressureUnits
                ))}
                contentElement={
                  <PressureComponent
                    pressure={testSavedCity.forecast.pressure}
                    units={testSavedCity.forecast.pressureUnits}
                  />
                }
              />
            </View>
            <View style={styles.row}>
              <WeatherDetailedPanel
                key="wind"
                color="#FF9A79"
                title={t('forecast.wind.main')}
                text={`${testSavedCity.forecast.windSpeed} ${
                  t(getReadableWindUnitsId(testSavedCity.forecast.windSpeedUnits))
                } (${t(getReadableWindDirectionId(
                  testSavedCity.forecast.windDirectionAngle
                ))})`}
                contentElement={
                  <WindComponent
                    speed={testSavedCity.forecast.windSpeed}
                    units={testSavedCity.forecast.windSpeedUnits}
                    directionAngle={testSavedCity.forecast.windDirectionAngle}
                  />
                }
              />
              <WeatherDetailedPanel
                key="air quality"
                color="#B9F4FB"
                title={t('forecast.airQuality.main')}
                text="#######"
                contentElement={<></>}
              />
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <View style={styles.forecastPanel} />
              </View>
            </View>
          </View>

          {/* TODO: remove in production code */}
          <Button title="Set widget" onPress={() => {
            WidgetService.setForecastOnWidget({
              name: 'sgrgf',
              state: 0,
              currentTemp: 10,
              maxTemp: 10,
              minTemp: -10,
            });
          }} />
          <Button title="Reset widget" onPress={() => WidgetService.resetWidget()} />
        </ScrollView>

        <View key="system navigation buttons"
          style={[
            styles.systemNavButtons,
            { height: insets.bottom },
          ]}
        />
      </ImageBackground>
      <View key="system status bar"
        style={[
          styles.systemStatusBar,
          { height: insets.top },
        ]}
      />
    </View>
  );
};
export default HomePage;
