import { Button, ImageBackground, ScrollView, useWindowDimensions, View } from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SystemBars } from 'react-native-edge-to-edge';
import { TabBar, TabBarItem, TabView } from 'react-native-tab-view';

import { styles } from './Home.styles.ts';
import { CustomText } from '../../components/CustomText/CustomText.tsx';
import {
  HumidityProps, MagneticActivityProps, PressureProps,
  WeatherDetailedPanelProps, WeatherPanelProps, WindProps,
} from './Home.types.ts';
import { WeatherIcon } from '../../components/WeatherIcon/WeatherIcon.tsx';
import { WeatherIconType } from '../../components/WeatherIcon/WeatherIcon.types.ts';
import MagneticActivityImg from '../../../assets/images/magnet_activity_5.svg';
import WindCompassImg from '../../../assets/images/compass.svg';
import WindCompassArrowImg from '../../../assets/images/compass_arrow.svg';
import { PagesNames } from '../../types/common/root-stack-params-list.ts';
import { useCustomNavigation } from '../../hooks/useCustomNavigation.ts';
import { SavedCity } from '../../types/api/SavedCity.ts';
import {createWeatherState, MoonPhases, PressureUnits, TempUnits, WindSpeedUnits} from '../../types/api/Forecast.ts';
import {
  convertPressure, convertTemperature, convertWindSpeed, getReadableGeomagneticDegreeId, getReadableHumidityId,
  getReadableMoonPhaseId, getReadablePressureId, getReadablePressureUnitsId, getReadableTemperatureUnitsId,
  getReadableWindDirectionId, getReadableWindUnitsId,
} from './Home.utils.ts';
import WeatherService from '../../services/WeatherService.ts';

import { WeatherModule } from '../../../specs/NativeModules.ts';
import {test} from '../../services/notifications/notifications.ts';
import {useUserSettings} from '../../services/UserSettingsProvider.tsx';

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

const WeatherPanel = ({temp, tempUnits,maxTemp, minTemp, icon, description, stateId }:WeatherPanelProps) => {
  const [cityWrapperWidth, setCityWrapperWidth] = useState(0);
  return (
    <View style={styles.topContainer}>
      <View
        style={styles.cityWrapper}
        onLayout={event => setCityWrapperWidth(event.nativeEvent.layout.width)}
      >
        {/* <CityCarousel
          cities={[]}
          onChange={city => console.log(city)}
          style={{ width: cityWrapperWidth }}
        /> */}
      </View>
      <View style={styles.weatherMainContainer}>
        <WeatherIcon type={WeatherIconType.PartlyCloudyDay} size={130} />
        <View />
        <CustomText style={styles.temperatureMain}>{temp.toPrecision(3)}{tempUnits}</CustomText>
      </View>
      <View style={styles.weatherDescriptionContainer}>
        <CustomText style={styles.weatherDescriptionText}>{description}</CustomText>
        <CustomText style={styles.temperatureAmplitudeText}>{maxTemp.toPrecision(3)}{tempUnits}/{minTemp.toPrecision(3)}{tempUnits}</CustomText>
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
      <CustomText style={styles.pressureText}>{pressure.toPrecision(4)}</CustomText>
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

const WeatherPage: React.FC<{ pageIndex: number }> = ({ pageIndex }) => {
  const {userSettings} = useUserSettings();
  let { t } = useTranslation();
  const navigation = useCustomNavigation();

  const insets = useSafeAreaInsets();

  const scrollRef = useRef<ScrollView>(null);

  const testSavedCity = {
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
      windDirectionAngle: 45,
      airQuality: 78,
      hourlyforecast: [
        { time: '12:00', state: -1, temp: 10.1 },
        { time: '12:00', state: -1,  temp: 10.1 },
        { time: '12:00', state: -1, temp: 10.1 },
      ],
    },
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [pageIndex]);

  return (
    <ScrollView
      ref={scrollRef}
      style={{
        marginLeft: insets.left,
        marginRight: insets.right,
      }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <WeatherPanel
        temp={convertTemperature(testSavedCity.forecast.currentTemp, testSavedCity.forecast.tempUnits, userSettings.temperature)}
        icon={''}
        description={t(createWeatherState(testSavedCity.forecast.state).translationId)}
        minTemp={convertTemperature(testSavedCity.forecast.minTemp, testSavedCity.forecast.tempUnits, userSettings.temperature)}
        maxTemp={convertTemperature(testSavedCity.forecast.maxTemp, testSavedCity.forecast.tempUnits, userSettings.temperature)}
        tempUnits={t(getReadableTemperatureUnitsId(userSettings.temperature))}
        stateId={testSavedCity.forecast.state}
      />
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
            text={t(
              getReadableGeomagneticDegreeId(
                testSavedCity.forecast.geomagneticActivity,
              ),
            )}
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
            text={t(
              getReadablePressureId(
                testSavedCity.forecast.pressure,
                testSavedCity.forecast.pressureUnits,
              ),
            )}
            contentElement={
              <PressureComponent
                pressure={convertPressure(
                  testSavedCity.forecast.pressure,
                  testSavedCity.forecast.pressureUnits,
                  userSettings.pressure,
                )}
                units={userSettings.pressure}
              />
            }
          />
        </View>
        <View style={styles.row}>
          <WeatherDetailedPanel
            key="wind"
            color="#FF9A79"
            title={t('forecast.wind.main')}
            text={`${convertWindSpeed(
              testSavedCity.forecast.windSpeed,
              testSavedCity.forecast.windSpeedUnits,
              userSettings.windSpeed,
            )} ${t(getReadableWindUnitsId(userSettings.windSpeed))} (${t(
              getReadableWindDirectionId(
                testSavedCity.forecast.windDirectionAngle,
              ),
            )})`}
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
      <Button
        title="town select"
        onPress={() => navigation.navigate(PagesNames.TownSelect)}
      />
      <Button
        title="рябов ответит (за всё)"
        onPress={() => navigation.navigate(PagesNames.MeteoChannel)}
      />
      <Button
        title="Настройки"
        onPress={() => navigation.navigate(PagesNames.Settings)}
      />
      <Button
        title="Toast test"
        onPress={() => WeatherModule.showTestToast()}
      />
      <Button title="Make notification" onPress={() => test()} />
    </ScrollView>
  );
};

const WeatherTabBar: React.FC<any> = (props) => {
  return (
    <TabBar
      style={styles.tabBar}
      renderTabBarItem={({key: _, ...props}) =>
        <TabBarItem
          label={props =>
            <CustomText
              numberOfLines={1}
              style={[styles.tabBarText, { color: props.color }]}
            >
              {props.labelText ?? ''}
            </CustomText>
          }
          {...props}
        />
      }
      scrollEnabled
      renderIndicator={() => null}
      {...props}
    />
  );
};

const HomePage = () => {

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
  useEffect(() => {
    console.log('calling fetchWeatherByCoords');
    WeatherService.fetchWeatherWithForecastByCoords(
      testSavedCity.city.latitude,
      testSavedCity.city.longitude,
    ).then(forecast => {
      setSavedCities(prevState => ({...prevState, forecast}));
    });
  }, [testSavedCity.city.latitude, testSavedCity.city.longitude]);

  const [index, setIndex] = React.useState(0);
  const layout = useWindowDimensions();

  const mockedRoutes = [
    { key: 'first', title: 'Минск' },
    { key: 'second', title: 'Москва' },
    { key: 'second1', title: 'Новосибирск' },
    { key: 'second2', title: 'Кировск' },
    { key: 'second3', title: 'Новополоцк' },
    { key: 'second4', title: 'Могилев' },
    { key: 'second5', title: 'Гомель' },
    { key: 'second6', title: 'Лондон' },
  ];

  return (
    <View style={styles.outerContainer} key="home page">
      <SystemBars style="light" />
      <ImageBackground
        style={styles.imageContainer}
        source={require('../../../assets/images/sample.png')}>
        <TabView
          lazy
          navigationState={{ index, routes: mockedRoutes }}
          style={{
            marginTop: insets.top,
          }}
          renderTabBar={WeatherTabBar}
          renderScene={() => <WeatherPage pageIndex={index} />}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />


        <View
          key="system navigation buttons"
          style={[styles.systemNavButtons, {height: insets.bottom}]}
        />
      </ImageBackground>
      <View
        key="system status bar"
        style={[styles.systemStatusBar, {height: insets.top}]}
      />
    </View>
  );
};
export default HomePage;
