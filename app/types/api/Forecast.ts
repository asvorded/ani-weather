export enum MoonPhases {
  NewMoon = 1,
  FirstHalf,
  FullMoon,
  LastHalf,
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
  time: string;
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
  clear,
  clouds,
}
export type WeatherState = {
  id: WeatherId;
  translationId: string;
  imageId: string;
};
export const createWeatherState = (id: WeatherId): WeatherState => {
  const resourceMap = {
    [WeatherId.none]: {
      id: WeatherId.none,
      translationId: 'forecast.weatherStates.none',
      imageId: 'icons/none.png',
    },
    [WeatherId.thunderstorm]: {
      id: WeatherId.thunderstorm,
      translationId: 'forecast.weatherStates.thunderstorm',
      imageId: 'icons/thunderstorm.png',
    },
    [WeatherId.drizzle]: {
      id: WeatherId.drizzle,
      translationId: 'forecast.weatherStates.drizzle',
      imageId: 'icons/drizzle.png',
    },
    [WeatherId.rain]: {
      id: WeatherId.rain,
      translationId: 'forecast.weatherStates.rain',
      imageId: 'icons/rain.png',
    },
    [WeatherId.snow]: {
      id: WeatherId.snow,
      translationId: 'forecast.weatherStates.snow',
      imageId: 'icons/snow.png',
    },
    [WeatherId.mist]: {
      id: WeatherId.mist,
      translationId: 'forecast.weatherStates.mist',
      imageId: 'icons/mist.png',
    },
    [WeatherId.smoke]: {
      id: WeatherId.smoke,
      translationId: 'forecast.weatherStates.smoke',
      imageId: 'icons/smoke.png',
    },
    [WeatherId.haze]: {
      id: WeatherId.haze,
      translationId: 'forecast.weatherStates.haze',
      imageId: 'icons/haze.png',
    },
    [WeatherId.dust]: {
      id: WeatherId.dust,
      translationId: 'forecast.weatherStates.dust',
      imageId: 'icons/dust.png',
    },
    [WeatherId.fog]: {
      id: WeatherId.fog,
      translationId: 'forecast.weatherStates.fog',
      imageId: 'icons/fog.png',
    },
    [WeatherId.sand]: {
      id: WeatherId.sand,
      translationId: 'forecast.weatherStates.sand',
      imageId: 'icons/sand.png',
    },
    [WeatherId.ash]: {
      id: WeatherId.ash,
      translationId: 'forecast.weatherStates.ash',
      imageId: 'icons/ash.png',
    },
    [WeatherId.squall]: {
      id: WeatherId.squall,
      translationId: 'forecast.weatherStates.squall',
      imageId: 'icons/squall.png',
    },
    [WeatherId.tornado]: {
      id: WeatherId.tornado,
      translationId: 'forecast.weatherStates.tornado',
      imageId: 'icons/tornado.png',
    },
    [WeatherId.clear]: {
      id: WeatherId.clear,
      translationId: 'forecast.weatherStates.clear',
      imageId: 'icons/clear.png',
    },
    [WeatherId.clouds]: {
      id: WeatherId.clouds,
      translationId: 'forecast.weatherStates.clouds',
      imageId: 'icons/clouds.png',
    },
  };

  const resources = resourceMap[id];

  return {
    id,
    translationId: resources.translationId,
    imageId: resources.imageId,
  };
};
export type Forecast = {
  currentTemp: number;
  tempUnits: TempUnits;
  state: WeatherId;
  shortDescription: string;
  maxTemp: number;
  minTemp: number;
  moonPhase: MoonPhases;
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
};
