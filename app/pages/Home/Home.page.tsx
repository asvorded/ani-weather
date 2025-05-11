import {
  Button,
  ImageBackground,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SystemBars } from 'react-native-edge-to-edge';
import { Route, TabBar, TabBarItem, TabView } from 'react-native-tab-view';

import { styles } from './Home.styles.ts';
import { CustomText } from '../../components/CustomText/CustomText.tsx';
import {
  ActionsPanelProps,
  HumidityProps, MagneticActivityProps, PressureProps,
  WeatherDetailedPanelProps, WeatherPanelProps, WindProps,
} from './Home.types.ts';
import { WeatherIcon } from '../../components/WeatherIcon/WeatherIcon.tsx';
import { WeatherIconType } from '../../components/WeatherIcon/WeatherIcon.types.ts';
import { PagesNames } from '../../types/common/root-stack-params-list.ts';
import { useCustomNavigation } from '../../hooks/useCustomNavigation.ts';
import {createWeatherState} from '../../types/api/Forecast.ts';
import {
  convertPressure, convertTemperature, convertWindSpeed, getReadableGeomagneticDegreeId, getReadableHumidityId,
  getReadableMoonPhaseId, getReadablePressureId, getReadablePressureUnitsId, getReadableTemperatureUnitsId,
  getReadableWindDirectionId, getReadableWindUnitsId,
} from './Home.utils.ts';
import {useUserSettings} from '../../services/UserSettingsProvider.tsx';

import AddDarkImg from '../../../assets/icons/add-dark.svg';
import AddLightImg from '../../../assets/icons/add-light.svg';
import SettingsLightImg from '../../../assets/icons/settings-light.svg';
import SettingsDarkImg from '../../../assets/icons/settings-dark.svg';
import MagneticActivityImg from '../../../assets/images/magnet_activity_5.svg';
import WindCompassImg from '../../../assets/images/compass.svg';
import WindCompassArrowImg from '../../../assets/images/compass_arrow.svg';

import { SavedCityWithForecast } from '../../types/storage/SavedCityWithForecast.ts';
//import {SavedCitiesService} from '../../services/SavedCitiesService.ts';
import * as LocationService from '../../services/LocationService.ts';
import * as CitiesService from '../../services/CitiesService.ts';
import { useSavedCities } from '../../hooks/useSavedCities.tsx';

const ActionsPanel = ({
  navOnCitySelectClick,
  navOnSettingsClick,
  isDarkMode,
  topWindowInset,
}: ActionsPanelProps) => {
  const buttonWidth = styles.actionButtonIcon.width;
  const buttonHeight = styles.actionButtonIcon.height;

  return (
    <View style={[styles.actionsPanel, {paddingTop: topWindowInset + 7}]}>
      <TouchableOpacity key="city select"
        style={styles.actionButton}
        onPress={() => navOnCitySelectClick()}
      >
        {isDarkMode ? (
          <AddLightImg width={buttonWidth} height={buttonHeight} />
        ) : (
          <AddDarkImg width={buttonWidth} height={buttonHeight} />
        )}
      </TouchableOpacity>
      <TouchableOpacity key="settings"
        style={styles.actionButton}
        onPress={() => navOnSettingsClick()}
      >
        {isDarkMode ? (
          <SettingsLightImg width={buttonWidth} height={buttonHeight} />
        ) : (
          <SettingsDarkImg width={buttonWidth} height={buttonHeight} />
        )}
      </TouchableOpacity>
    </View>
  );
};

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

const WeatherPanel = ({
  temp, tempUnits, maxTemp, minTemp,
  icon, description, stateId,
}: WeatherPanelProps) => {
  const [cityWrapperWidth, setCityWrapperWidth] = useState(0);
  return (
    <View style={styles.topContainer}>
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

const WeatherPage: React.FC<{
  cityWithForecast: SavedCityWithForecast,
  pageIndex: number
}> = ({ cityWithForecast, pageIndex }) => {
  const {userSettings} = useUserSettings();
  let { t, i18n } = useTranslation();
  const navigation = useCustomNavigation();
  const insets = useSafeAreaInsets();

  const {service} = useSavedCities();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    if (cityWithForecast.savedCity.isGeolocation === true) {
      // Try update location
      LocationService.findLocationWithCallbacks((position) => {
        // Set new location and get new forecast
        CitiesService.getCityFromCoordsOSM(position.coords.latitude, position.coords.longitude, i18n.language)
          .then((foundCity) => {
            service.updateGeolocationCity(foundCity);
          })
          .catch(() => {
            service.updateExistingGeolocationForecast();
          })
          .finally(() => {
            setRefreshing(false);
          });
      }, () => {
        service.updateExistingGeolocationForecast()
          .finally(() => {
            setRefreshing(false);
          });
      });
    } else {
      service.updateCityForecast(cityWithForecast);
      setRefreshing(false);
    }
  }, [service, cityWithForecast, i18n]);

  return (
    <ScrollView
      style={{
        marginLeft: insets.left,
        marginRight: insets.right,
      }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <WeatherPanel key="weather panel"
        temp={convertTemperature(cityWithForecast.forecast.currentTemp, cityWithForecast.forecast.tempUnits, userSettings.temperature)}
        icon={''}
        description={t(createWeatherState(cityWithForecast.forecast.state).translationId)}
        minTemp={convertTemperature(cityWithForecast.forecast.minTemp, cityWithForecast.forecast.tempUnits, userSettings.temperature)}
        maxTemp={convertTemperature(cityWithForecast.forecast.maxTemp, cityWithForecast.forecast.tempUnits, userSettings.temperature)}
        tempUnits={t(getReadableTemperatureUnitsId(userSettings.temperature))}
        stateId={cityWithForecast.forecast.state}
      />
      <View style={styles.detailsGrid}>
        <View style={styles.row}>
          <WeatherDetailedPanel
            key="moon phase"
            color="#A9E788"
            title={t('forecast.moonPhase.main')}
            text={t(getReadableMoonPhaseId(cityWithForecast.forecast.moonPhase))}
            contentElement={<MoonPhaseComponent />}
          />
          <WeatherDetailedPanel
            key="geomag"
            color="#B3DBFF"
            title={t('forecast.geomagnetic.main')}
            text={t(
              getReadableGeomagneticDegreeId(
                cityWithForecast.forecast.geomagneticActivity,
              ),
            )}
            contentElement={
              <MagneticActivityComponent
                degree={cityWithForecast.forecast.geomagneticActivity}
              />
            }
          />
        </View>
        <View style={styles.row}>
          <WeatherDetailedPanel
            key="humidity"
            color="#FFE179"
            title={t('forecast.humidity.main')}
            text={t(getReadableHumidityId(cityWithForecast.forecast.humidity))}
            contentElement={
              <HumidityComponent humidity={cityWithForecast.forecast.humidity} />
            }
          />
          <WeatherDetailedPanel
            key="pressure"
            color="#FBB9BA"
            title={t('forecast.pressure.main')}
            text={t(
              getReadablePressureId(
                cityWithForecast.forecast.pressure,
                cityWithForecast.forecast.pressureUnits,
              ),
            )}
            contentElement={
              <PressureComponent
                pressure={convertPressure(
                  cityWithForecast.forecast.pressure,
                  cityWithForecast.forecast.pressureUnits,
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
              cityWithForecast.forecast.windSpeed,
              cityWithForecast.forecast.windSpeedUnits,
              userSettings.windSpeed,
            )} ${t(getReadableWindUnitsId(userSettings.windSpeed))} (${t(
              getReadableWindDirectionId(
                cityWithForecast.forecast.windDirectionAngle,
              ),
            )})`}
            contentElement={
              <WindComponent
                speed={cityWithForecast.forecast.windSpeed}
                units={cityWithForecast.forecast.windSpeedUnits}
                directionAngle={cityWithForecast.forecast.windDirectionAngle}
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
        title="рябов ответит (за всё)"
        onPress={() => navigation.navigate(PagesNames.MeteoChannel)}
      />
    </ScrollView>
  );
};

const WeatherTabBar: React.FC<any> = (props) => {
  return (
    <TabBar key="cities tab bar"
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
  const navigation = useCustomNavigation();
  const insets = useSafeAreaInsets();
  const layout = useWindowDimensions();

  const {savedCities} = useSavedCities();
  const [index, setIndex] = React.useState(0);

  useEffect(() => {
    if (savedCities.length === 0) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
      navigation.replace(PagesNames.TownSelect);
    }
  }, [savedCities, navigation]);

  let routesWithCities: {[key: string]: SavedCityWithForecast} = {};

  const citiesRoutes: Route[] = savedCities.map((savedCity) => {
    const key: string = `${savedCity.savedCity.coords.long}-${savedCity.savedCity.coords.lat}`;
    routesWithCities[key] = savedCity;
    return {
      key: key,
      title: savedCity.savedCity.name,
      icon: savedCity.savedCity.isGeolocation === true ? 'location' : undefined,
    };
  });

  return (
    <View style={styles.outerContainer} key="home page">
      <SystemBars style="light" />
      <ImageBackground
        style={styles.imageContainer}
        // TODO: background from weather state
        source={require('../../../assets/images/sample.png')}
      >
        <ActionsPanel
          navOnCitySelectClick={() => {
            navigation.navigate(PagesNames.TownSelect);
          }}
          navOnSettingsClick={() => {
            navigation.navigate(PagesNames.Settings);
          }}
          isDarkMode={true}
          topWindowInset={insets.top}
        />

        {citiesRoutes.length > 0 ? (
          <TabView key="tab view for cities"
            navigationState={{ index, routes: citiesRoutes }}
            renderTabBar={WeatherTabBar}
            renderScene={(route) => <WeatherPage cityWithForecast={routesWithCities[route.route.key]} pageIndex={index} />}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
          />
        ) : null}

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
