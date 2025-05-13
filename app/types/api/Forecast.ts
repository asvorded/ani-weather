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
};
export const createWeatherState = (id: WeatherId): WeatherState => {
  const resourceMap = {
    [WeatherId.none]: {
      id: WeatherId.none,
      translationId: 'forecast.weatherStates.none',
      image: clearDay,
    },
    [WeatherId.thunderstorm]: {
      id: WeatherId.thunderstorm,
      translationId: 'forecast.weatherStates.thunderstorm',
      image: thunderstorm,
    },
    [WeatherId.drizzle]: {
      id: WeatherId.drizzle,
      translationId: 'forecast.weatherStates.drizzle',
      image: fog,
    },
    [WeatherId.rain]: {
      id: WeatherId.rain,
      translationId: 'forecast.weatherStates.rain',
      image: rain,
    },
    [WeatherId.snow]: {
      id: WeatherId.snow,
      translationId: 'forecast.weatherStates.snow',
      image: snow,
    },
    [WeatherId.mist]: {
      id: WeatherId.mist,
      translationId: 'forecast.weatherStates.mist',
      image: fog,
    },
    [WeatherId.smoke]: {
      id: WeatherId.smoke,
      translationId: 'forecast.weatherStates.smoke',
      image: dust,
    },
    [WeatherId.haze]: {
      id: WeatherId.haze,
      translationId: 'forecast.weatherStates.haze',
      image: dust,
    },
    [WeatherId.dust]: {
      id: WeatherId.dust,
      translationId: 'forecast.weatherStates.dust',
      image: dust,
    },
    [WeatherId.fog]: {
      id: WeatherId.fog,
      translationId: 'forecast.weatherStates.fog',
      image: fog,
    },
    [WeatherId.sand]: {
      id: WeatherId.sand,
      translationId: 'forecast.weatherStates.sand',
      image: dust,
    },
    [WeatherId.ash]: {
      id: WeatherId.ash,
      translationId: 'forecast.weatherStates.ash',
      image: dust,
    },
    [WeatherId.squall]: {
      id: WeatherId.squall,
      translationId: 'forecast.weatherStates.squall',
      image: squall,
    },
    [WeatherId.tornado]: {
      id: WeatherId.tornado,
      translationId: 'forecast.weatherStates.tornado',
      image: tornado,
    },
    [WeatherId.clearDay]: {
      id: WeatherId.clearDay,
      translationId: 'forecast.weatherStates.clear',
      image: clearDay,
    },
    [WeatherId.cloudsDay]: {
      id: WeatherId.cloudsDay,
      translationId: 'forecast.weatherStates.clouds',
      image: cloudsDay,
    },
    [WeatherId.clearNight]: {
      id: WeatherId.clearNight,
      translationId: 'forecast.weatherStates.clear',
      image: clearNight,
    },
    [WeatherId.cloudsNight]: {
      id: WeatherId.cloudsNight,
      translationId: 'forecast.weatherStates.clouds',
      image: cloudsNight,
    },
  };

  const resources = resourceMap[id];

  return {
    id,
    translationId: resources.translationId,
    image: resources.image,
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
