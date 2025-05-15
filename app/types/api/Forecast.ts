import React from 'react';
import {SvgProps} from 'react-native-svg';
import clearDay from '../../../assets/images/weather_icons/clearDay.svg';
import clearNight from '../../../assets/images/weather_icons/clearNight.svg';
import cloudsDay from '../../../assets/images/weather_icons/cloudyDay.svg';
import cloudsNight from '../../../assets/images/weather_icons/cloudyNight.svg';
import thunderstorm from '../../../assets/images/weather_icons/thunderstorm.svg';
import rain from '../../../assets/images/weather_icons/rain.svg';
import snow from '../../../assets/images/weather_icons/snow.svg';
import dust from '../../../assets/images/weather_icons/dust.svg';
import fog from '../../../assets/images/weather_icons/fog.svg';
import squall from '../../../assets/images/weather_icons/squall.svg';
import tornado from '../../../assets/images/weather_icons/tornado.svg';


export enum MoonPhase {
  NewMoon,
  WaxingCrescent,
  FirstQuarter,
  WaxingGibbous,
  FullMoon,
  WaningGibbous,
  ThirdQuarter,
  WaningCrescent,
}

export enum TempUnits {
  Celsius = 1,
  Kelvin,
  Fahrenheit,
}

export enum PressureUnits {
  Pascal = 1,
  MmHg,
}

export enum WindSpeedUnits {
  Kmh = 1,
  Ms,
}

export type HourForecast = {
  time: Date;
  state: WeatherId;
  temp: number;
};
export enum WeatherId {
  none = -1,
  thunderstorm,
  drizzle,
  rain,
  snow,
  mist,
  smoke,
  haze,
  dust,
  fog,
  sand,
  ash,
  squall,
  tornado,
  clearDay,
  clearNight,
  cloudsDay,
  cloudsNight
}
export type WeatherState = {
  id: WeatherId;
  translationId: string;
  image: React.FC<SvgProps>;
  background: number;
  lightDarkThemeFactor: number;
};
export const createWeatherState = (id: WeatherId): WeatherState => {
  const resourceMap = {
    [WeatherId.none]: {
      id: WeatherId.none,
      translationId: 'forecast.weatherStates.none',
      image: clearDay,
      background: require('../../../assets/images/backgrounds/background-light.jpg'),
      lightDarkThemeFactor: 0,
    },
    [WeatherId.thunderstorm]: {
      id: WeatherId.thunderstorm,
      translationId: 'forecast.weatherStates.thunderstorm',
      image: thunderstorm,
      background: require('../../../assets/images/backgrounds/background-light.jpg'),
      lightDarkThemeFactor: 0,
    },
    [WeatherId.drizzle]: {
      id: WeatherId.drizzle,
      translationId: 'forecast.weatherStates.drizzle',
      image: fog,
      background: require('../../../assets/images/backgrounds/background-light.jpg'),
      lightDarkThemeFactor: 0,
    },
    [WeatherId.rain]: {
      id: WeatherId.rain,
      translationId: 'forecast.weatherStates.rain',
      image: rain,
      background: require('../../../assets/images/backgrounds/background-rain.jpg'),
      lightDarkThemeFactor: 0.2,
    },
    [WeatherId.snow]: {
      id: WeatherId.snow,
      translationId: 'forecast.weatherStates.snow',
      image: snow,
      background: require('../../../assets/images/backgrounds/background-light.jpg'),
      lightDarkThemeFactor: 0,
    },
    [WeatherId.mist]: {
      id: WeatherId.mist,
      translationId: 'forecast.weatherStates.mist',
      image: fog,
      background: require('../../../assets/images/backgrounds/background-light.jpg'),
      lightDarkThemeFactor: 0,
    },
    [WeatherId.smoke]: {
      id: WeatherId.smoke,
      translationId: 'forecast.weatherStates.smoke',
      image: dust,
      background: require('../../../assets/images/backgrounds/background-light.jpg'),
      lightDarkThemeFactor: 0,
    },
    [WeatherId.haze]: {
      id: WeatherId.haze,
      translationId: 'forecast.weatherStates.haze',
      image: dust,
      background: require('../../../assets/images/backgrounds/background-light.jpg'),
      lightDarkThemeFactor: 0,
    },
    [WeatherId.dust]: {
      id: WeatherId.dust,
      translationId: 'forecast.weatherStates.dust',
      image: dust,
      background: require('../../../assets/images/backgrounds/background-light.jpg'),
      lightDarkThemeFactor: 0,
    },
    [WeatherId.fog]: {
      id: WeatherId.fog,
      translationId: 'forecast.weatherStates.fog',
      image: fog,
      background: require('../../../assets/images/backgrounds/background-light.jpg'),
      lightDarkThemeFactor: 0,
    },
    [WeatherId.sand]: {
      id: WeatherId.sand,
      translationId: 'forecast.weatherStates.sand',
      image: dust,
      background: require('../../../assets/images/backgrounds/background-light.jpg'),
      lightDarkThemeFactor: 0,
    },
    [WeatherId.ash]: {
      id: WeatherId.ash,
      translationId: 'forecast.weatherStates.ash',
      image: dust,
      background: require('../../../assets/images/backgrounds/background-light.jpg'),
      lightDarkThemeFactor: 0,
    },
    [WeatherId.squall]: {
      id: WeatherId.squall,
      translationId: 'forecast.weatherStates.squall',
      image: squall,
      background: require('../../../assets/images/backgrounds/background-light.jpg'),
      lightDarkThemeFactor: 0,
    },
    [WeatherId.tornado]: {
      id: WeatherId.tornado,
      translationId: 'forecast.weatherStates.tornado',
      image: tornado,
      background: require('../../../assets/images/backgrounds/background-light.jpg'),
      lightDarkThemeFactor: 0,
    },
    [WeatherId.clearDay]: {
      id: WeatherId.clearDay,
      translationId: 'forecast.weatherStates.clear',
      image: clearDay,
      background: require('../../../assets/images/backgrounds/background-light.jpg'),
      lightDarkThemeFactor: 0,
    },
    [WeatherId.cloudsDay]: {
      id: WeatherId.cloudsDay,
      translationId: 'forecast.weatherStates.clouds',
      image: cloudsDay,
      background: require('../../../assets/images/backgrounds/background-cloudyDay.jpg'),
      lightDarkThemeFactor: 0,
    },
    [WeatherId.clearNight]: {
      id: WeatherId.clearNight,
      translationId: 'forecast.weatherStates.clear',
      image: clearNight,
      background: require('../../../assets/images/backgrounds/background-clearNight.jpg'),
      lightDarkThemeFactor: 1,
    },
    [WeatherId.cloudsNight]: {
      id: WeatherId.cloudsNight,
      translationId: 'forecast.weatherStates.clouds',
      image: cloudsNight,
      background: require('../../../assets/images/backgrounds/background-cloudyNight.jpg'),
      lightDarkThemeFactor: 1,
    },
  };

  const resources = resourceMap[id];

  return {
    id,
    translationId: resources.translationId,
    image: resources.image,
    background: resources.background,
    lightDarkThemeFactor: resources.lightDarkThemeFactor,
  };
};
export type Forecast = {
  currentTemp: number;
  tempUnits: TempUnits;
  state: WeatherId;
  shortDescription: string;
  maxTemp: number;
  minTemp: number;
  moonPhase: MoonPhase;
  geomagneticActivity: number;
  humidity: number;
  pressure: number;
  pressureUnits: PressureUnits;
  windSpeed: number;
  windSpeedUnits: WindSpeedUnits;
  windDirectionAngle: number;
  airQuality: number;
  hourlyforecast: HourForecast[];
  lastUpdated: number;
  timezone: number;
  sunrise: number;
  sunset: number;
};
