// noinspection t

import {
  Button,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SystemBars } from 'react-native-edge-to-edge';

import { styles } from './Home.styles.ts';
import {
  ActionsPanelProps, AqiProps,
  CitiesTabBarProps,
  ForecastPanelProps,
  HumidityProps, SunsetSunriseProps, MoonProps, PressureProps,
  WeatherDetailedPanelProps, WeatherPanelProps, WindProps,
} from './Home.types.ts';

import { PagesNames } from '../../types/common/root-stack-params-list.ts';
import { useCustomNavigation } from '../../hooks/useCustomNavigation.ts';
import {createWeatherState, WeatherId} from '../../types/api/Forecast.ts';
import {
  convertPressure,
  convertTemperature,
  convertWindSpeed,
  getBackgroundForAqi, getMoonPhaseImagePath, getReadableAqiId,
  getReadableHumidityId,
  getReadableMoonPhaseId,
  getReadablePressureId,
  getReadablePressureUnitsId,
  getReadableTemperatureUnitsId,
  getReadableWindDirectionId,
  getReadableWindUnitsId,
} from './Home.utils.ts';
import {useUserSettings} from '../../services/UserSettingsProvider.tsx';

import AddDarkImg from '../../../assets/icons/add-dark.svg';
import AddLightImg from '../../../assets/icons/add-light.svg';
import SettingsLightImg from '../../../assets/icons/settings-light.svg';
import SettingsDarkImg from '../../../assets/icons/settings-dark.svg';
import WindCompassImg from '../../../assets/images/compass.svg';
import WindCompassArrowImg from '../../../assets/images/compass_arrow.svg';
import LocationLightImg from '../../../assets/icons/location-small-light.svg';

import { SavedCityWithForecast } from '../../types/storage/SavedCityWithForecast.ts';
//import {SavedCitiesService} from '../../services/SavedCitiesService.ts';
import * as LocationService from '../../services/LocationService.ts';
import * as CitiesService from '../../services/CitiesService.ts';
import { useSavedCities } from '../../hooks/useSavedCities.tsx';
import CustomIcon from '../../components/CustomIcon/CustomIcon.tsx';
import AnimatedBackground from '../../components/AnimatedBackground/AnimatedBackgroundImage.tsx';
import {useAnimatedBackground} from '../../hooks/useAnimatedBackground.tsx';
import {useWeatherTheme, WeatherThemeProvider} from '../../hooks/useWeatherTheme.tsx';
import {CustomWeatherText} from '../../components/CustomWeatherText/CustomWeatherText.tsx';
import Animated, {
  interpolateColor,
  useAnimatedStyle, useDerivedValue,
} from 'react-native-reanimated';
import {CustomText} from '../../components/CustomText/CustomText.tsx';

const ActionsPanel = ({
  navOnCitySelectClick,
  navOnSettingsClick,
  windowInsets,
}: ActionsPanelProps) => {
  const buttonWidth = styles.actionButtonIcon.width;
  const buttonHeight = styles.actionButtonIcon.height;
  return (
    <View style={[
      styles.actionsPanel,
      {
        marginTop: windowInsets.top,
        marginLeft: windowInsets.left,
        marginRight: windowInsets.right,
      },
    ]}>
      <TouchableOpacity key="city select"
        style={styles.actionButton}
        onPress={() => navOnCitySelectClick()}
      >
        <CustomIcon
          DarkIcon={AddLightImg}
          LightIcon={AddDarkImg}
          width={buttonWidth}
          height={buttonHeight}
        />
      </TouchableOpacity>
      <TouchableOpacity key="settings"
        style={styles.actionButton}
        onPress={() => navOnSettingsClick()}
      >
        <CustomIcon
          DarkIcon={SettingsLightImg} LightIcon={SettingsDarkImg}
          width={buttonWidth} height={buttonHeight}
        />
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
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: color,
    opacity: 0.75,
  }));
  return (
    <View style={styles.cell}>
      <Animated.View style={[styles.detailsPanel, animatedStyle]}>
        <View style={styles.detailsPanelContentWrapper}>
          {contentElement}
        </View>
        <View style={styles.detailsTextPanel}>
          <CustomWeatherText style={styles.detailsPanelTitle}>{title}</CustomWeatherText>
          <CustomWeatherText style={styles.detailsPanelText}>{text}</CustomWeatherText>
        </View>
      </Animated.View>
    </View>
  );
};

const WeatherPanel = ({
  temp, tempUnits, maxTemp, minTemp,
  Icon, description,
}: WeatherPanelProps) => {
  return (
    <View style={styles.topContainer}>
      <View style={styles.weatherMainContainer}>
        <Icon width={130} height={130} />
        <View />
        <CustomWeatherText style={styles.temperatureMain}>{temp.toFixed(1)}{tempUnits}</CustomWeatherText>
      </View>
      <View style={styles.weatherDescriptionContainer}>
        <CustomWeatherText style={styles.weatherDescriptionText}>{description}</CustomWeatherText>
        <CustomWeatherText style={styles.temperatureAmplitudeText}>{maxTemp.toFixed(1)}{tempUnits}/{minTemp.toFixed(1)}{tempUnits}</CustomWeatherText>
      </View>
    </View>
  );
};

const MoonPhaseComponent = ({phase}:MoonProps) => {
  return (
    <View style={styles.moonPhaseComponent}>
      <Image source={getMoonPhaseImagePath(phase)}
        style={styles.moonPhaseImage}
        resizeMethod="auto"
        resizeMode="center"/>
    </View>
  );
};

const SunsetSunriseComponent = ({
  Icon,
}: SunsetSunriseProps) => {
  return (
    <View style={styles.sunsetSunriseComponent}>
      <Icon height={65} width={65} />
    </View>
  );
};

const HumidityComponent = ({
  humidity,
}: HumidityProps) => {
  return (
    <View style={styles.humidityComponent}>
      <CustomWeatherText style={styles.humidityText}>{`${humidity}%`}</CustomWeatherText>
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
      <CustomWeatherText style={styles.pressureText}>{pressure.toFixed(0)}</CustomWeatherText>
      <CustomWeatherText style={styles.pressureUnits}>
        {t(getReadablePressureUnitsId(units))}
      </CustomWeatherText>
    </View>
  );
};
const AqiComponent = ({
  aqi,
}: AqiProps) => {
  const { t } = useTranslation();

  return (
    <View style={[{backgroundColor: getBackgroundForAqi(aqi)}, styles.aiqComponent]}>
      <CustomWeatherText style={styles.pressureUnits}>
        {t('forecast.airQuality.title')}
      </CustomWeatherText>
      <CustomWeatherText style={styles.pressureText}>{aqi}</CustomWeatherText>
    </View>
  );
};

const WindComponent = ({directionAngle}: WindProps) => {
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
const ForecastPanel = React.memo(({hourlyForecast, tempUnits ,newTempUnits, color}: ForecastPanelProps) => {
  const { t } = useTranslation();
  return (
    <View style={[styles.forecastPanel, {backgroundColor: color}]}>
      <ScrollView
        horizontal={true}
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.forecastPanelScroll}
      >
        {hourlyForecast.map((item, index) => {
          const { state, temp, time } = item;

          return (
            <View style={styles.forecastItem} key={index}>
              {React.createElement(createWeatherState(state).image, { style: styles.weatherIcon })}
              <CustomWeatherText style={styles.temperature}>
                {convertTemperature(temp, tempUnits, newTempUnits).toFixed(1)} {t(getReadableTemperatureUnitsId(newTempUnits))}
              </CustomWeatherText>
              <CustomWeatherText style={styles.time}>
                {new Date(time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hourCycle: 'h23',
                  timeZone: 'UTC',
                })}
              </CustomWeatherText>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
});


const WeatherPage: React.FC<{
  cityWithForecast: SavedCityWithForecast,
  pageIndex: number
}> = ({ cityWithForecast, pageIndex }) => {
  const {userSettings} = useUserSettings();
  const {progress} = useWeatherTheme();
  let { t } = useTranslation();
  const navigation = useCustomNavigation();
  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const interpolatedColors = useDerivedValue(() => {
    const currentProgress = progress.value;
    return {
      moon: interpolateColor(currentProgress, [0, 1], ['#A9E788', '#71c144']),
      sun: interpolateColor(currentProgress, [0, 1], ['#B3DBFF', '#89b4d8']),
      humidity: interpolateColor(currentProgress, [0, 1], ['#FFE179', '#e6c86d']),
      pressure: interpolateColor(currentProgress, [0, 1], ['#FBB9BA', '#e2a1a2']),
      wind: interpolateColor(currentProgress, [0, 1], ['#FF9A79', '#e6876a']),
      aqi: interpolateColor(currentProgress, [0, 1], ['#B9F4FB', '#a2d7e1']),
      forecast: interpolateColor(currentProgress, [0, 1], ['#CEBBFF', '#9d7bd8']),
    };
  });



  return (
    <View style={[
      {
        marginLeft: insets.left,
        marginRight: insets.right,
        ...styles.container,
        width: dimensions.width - insets.left - insets.right,
      },
      styles.container,
    ]}>
      <WeatherPanel key="weather panel"
        temp={convertTemperature(cityWithForecast.forecast.currentTemp, cityWithForecast.forecast.tempUnits, userSettings.temperature)}
        Icon={createWeatherState(cityWithForecast.forecast.state).image}
        description={t(createWeatherState(cityWithForecast.forecast.state).translationId)}
        minTemp={convertTemperature(cityWithForecast.forecast.minTemp, cityWithForecast.forecast.tempUnits, userSettings.temperature)}
        maxTemp={convertTemperature(cityWithForecast.forecast.maxTemp, cityWithForecast.forecast.tempUnits, userSettings.temperature)}
        tempUnits={t(getReadableTemperatureUnitsId(userSettings.temperature))}
      />
      <View style={styles.detailsGrid}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <ForecastPanel
              hourlyForecast={cityWithForecast.forecast.hourlyforecast}
              newTempUnits={userSettings.temperature}
              tempUnits={cityWithForecast.forecast.tempUnits}
              color={interpolatedColors.value.forecast}/>
          </View>
        </View>
        <View style={styles.row}>
          <WeatherDetailedPanel
            key="moon phase"
            color={interpolatedColors.value.moon}
            title={t('forecast.moonPhases.main')}
            text={t(getReadableMoonPhaseId(cityWithForecast.forecast.moonPhase))}
            contentElement={<MoonPhaseComponent phase={cityWithForecast.forecast.moonPhase} />}
          />
          <WeatherDetailedPanel
            key="sunsetsunrise"
            color={interpolatedColors.value.sun}
            title={t('forecast.sunsetSunrise.main')}
            text={new Date((cityWithForecast.forecast.sunrise + cityWithForecast.forecast.timezone) * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hourCycle: 'h23',
            })
              + ' / ' + new Date((cityWithForecast.forecast.sunset + cityWithForecast.forecast.timezone) * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hourCycle: 'h23',
            })}
            contentElement={
              <SunsetSunriseComponent
                Icon={createWeatherState(
                  cityWithForecast.forecast.lastUpdated > cityWithForecast.forecast.sunrise
                  && cityWithForecast.forecast.lastUpdated < cityWithForecast.forecast.sunset
                    ? WeatherId.clearDay : WeatherId.clearNight).image}
              />
            }
          />
        </View>
        <View style={styles.row}>
          <WeatherDetailedPanel
            key="humidity"
            color={interpolatedColors.value.humidity}
            title={t('forecast.humidity.main')}
            text={t(getReadableHumidityId(cityWithForecast.forecast.humidity))}
            contentElement={
              <HumidityComponent humidity={cityWithForecast.forecast.humidity} />
            }
          />
          <WeatherDetailedPanel
            key="pressure"
            color={interpolatedColors.value.pressure}
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
            color={interpolatedColors.value.wind}
            title={t('forecast.wind.main')}
            text={`${convertWindSpeed(
              cityWithForecast.forecast.windSpeed,
              cityWithForecast.forecast.windSpeedUnits,
              userSettings.windSpeed,
            ).toFixed(1)} ${t(getReadableWindUnitsId(userSettings.windSpeed))} (${t(
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
            color={interpolatedColors.value.aqi}
            title={t('forecast.airQuality.main')}
            text={t(getReadableAqiId(cityWithForecast.forecast.airQuality))}
            contentElement={<AqiComponent aqi={cityWithForecast.forecast.airQuality} />}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.customButton}
        onPress={() => navigation.navigate(PagesNames.MeteoChannel)}
      >
        <CustomText style={styles.customButtonText}>{t('meteoChannel.link')}</CustomText>
      </TouchableOpacity>
    </View>
  );
};

const CitiesTabBar: React.FC<CitiesTabBarProps> = ({
  citiesList: citiesPagesList,
  selectedCityIndex,
}) => {
  const cityName = citiesPagesList[selectedCityIndex]?.savedCity.name;

  return (
    <View style={styles.citiesTabBarContainer}>
      <CustomWeatherText style={styles.citiesTabBarTitle}>
        {cityName}
      </CustomWeatherText>
      <View style={styles.citiesTabBarDots}>
        {citiesPagesList.map((city, i) => city.savedCity.isGeolocation ? (
          <LocationLightImg
            key={i}
            width={10} height={10}
            opacity={i === selectedCityIndex ? 1 : 0.5} />
        ) : (
          <View
            key={i}
            style={[
              styles.citiesTabBarDot,
              i !== selectedCityIndex ? styles.citiesTabBarDotInactive : undefined,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const HomePage = () => {
  const navigation = useCustomNavigation();
  const insets = useSafeAreaInsets();
  const {i18n} = useTranslation();
  const {setNewBackground} = useAnimatedBackground();
  const {toggleTheme} = useWeatherTheme();
  const {savedCities, service} = useSavedCities();
  const [selectedCityIndex, setSelectedCityIndex] = React.useState(0);

  const [refreshing, setRefreshing] = React.useState(false);
  useEffect(() => {
    if (savedCities.length === 0) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
      navigation.replace(PagesNames.TownSelect);
    }
  }, [savedCities, navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    const currentCity = savedCities[selectedCityIndex];

    if (currentCity.savedCity.isGeolocation === true) {
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
      service.updateCityForecast(currentCity)
        .finally(() => {
          setRefreshing(false);
        });
    }
  }, [service, savedCities, selectedCityIndex, i18n]);

  // noinspection t
  return (
    <View style={styles.outerContainer} key="home page">
      <SystemBars style="light" />
      <AnimatedBackground />
      <View
        style={styles.imageContainer}
      >
        <ActionsPanel
          navOnCitySelectClick={() => {
            navigation.navigate(PagesNames.TownSelect);
          }}
          navOnSettingsClick={() => {
            navigation.navigate(PagesNames.Settings);
          }}
          isDarkMode={true}
          windowInsets={insets}
        />

        <CitiesTabBar
          selectedCityIndex={selectedCityIndex}
          citiesList={savedCities}
        />
        <ScrollView key="city pages"
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          refreshControl={selectedCityIndex < savedCities.length ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined}
        >
          <FlatList
            data={savedCities}
            nestedScrollEnabled={true}
            keyExtractor={(item, index) =>
              `${item.forecast.lastUpdated}_${index}`
            }
            renderItem={item => (
              <WeatherPage
                cityWithForecast={item.item}
                pageIndex={selectedCityIndex}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50,
            }}
            onViewableItemsChanged={({ viewableItems }) => {
              const pageIndex = viewableItems[0]?.index;
              if (pageIndex !== undefined && pageIndex !== null) {
                setSelectedCityIndex(pageIndex);
                setNewBackground(createWeatherState(savedCities[pageIndex].forecast.state).background);
                toggleTheme(createWeatherState(savedCities[pageIndex].forecast.state).lightDarkThemeFactor);
              }
            }}
          />
        </ScrollView>

        <View
          key="system navigation buttons"
          style={[styles.systemNavButtons, {height: insets.bottom}]}
        />
      </View>
      <View
        key="system status bar"
        style={[styles.systemStatusBar, {height: insets.top}]}
      />
    </View>
  );
};

export default HomePage;
