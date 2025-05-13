import axios from 'axios';
import {
  Forecast,
  MoonPhase,
  PressureUnits,
  TempUnits,
  WeatherId,
  WindSpeedUnits,
} from '../types/api/Forecast.ts';

class WeatherService {
  private static API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '';
  private static currentWeatherOWUrl =
    'https://api.openweathermap.org/data/2.5/weather';
  private static forecastWeatherOWUrl =
    'https://api.openweathermap.org/data/2.5/forecast';
  private static airQualityUrl =
    'https://api.openweathermap.org/data/2.5/air_pollution';

  public static async fetchWeatherByCity(city: string): Promise<Forecast> {
    try {
      const [currentWeatherResponse, forecastResponse, airQualityResponse] =
        await Promise.all([
          axios.get(WeatherService.currentWeatherOWUrl, {
            params: {
              q: city,
              appid: WeatherService.API_KEY,
              units: 'metric',
            },
          }),
          axios.get(WeatherService.forecastWeatherOWUrl, {
            params: {
              q: city,
              appid: WeatherService.API_KEY,
              units: 'metric',
            },
          }),
          axios.get(WeatherService.airQualityUrl, {
            params: {
              q: city,
              appid: WeatherService.API_KEY,
            },
          }),
        ]);
      return WeatherService.mapDataToForecast(
        currentWeatherResponse.data,
        forecastResponse.data,
        airQualityResponse.data,
      );
    } catch (error: any) {
      throw new Error(`Ошибка: ${error.response?.statusText || error.message}`);
    }
  }

  public static async fetchWeatherWithForecastByCoords(
    latitude: number,
    longitude: number,
  ): Promise<Forecast> {
    try {
      const [currentWeatherResponse, forecastResponse, airQualityResponse] =
        await Promise.all([
          axios.get(WeatherService.currentWeatherOWUrl, {
            params: {
              lat: latitude,
              lon: longitude,
              appid: WeatherService.API_KEY,
              units: 'metric',
            },
          }),
          axios.get(WeatherService.forecastWeatherOWUrl, {
            params: {
              lat: latitude,
              lon: longitude,
              appid: WeatherService.API_KEY,
              units: 'metric',
            },
          }),
          axios.get(WeatherService.airQualityUrl, {
            params: {
              lat: latitude,
              lon: longitude,
              appid: WeatherService.API_KEY,
            },
          }),
        ]);
      console.log(airQualityResponse.data);
      return WeatherService.mapDataToForecast(
        currentWeatherResponse.data,
        forecastResponse.data,
        airQualityResponse.data,
      );
    } catch (error: any) {
      throw new Error(`Ошибка: ${error.response?.statusText || error.message}`);
    }
  }
  private static mapDataToForecast(
    data: any,
    forecastData: any,
    airQualityData: any,
  ): Forecast {
    return {
      airQuality: WeatherService.getCaqi(airQualityData),
      geomagneticActivity: 0,
      hourlyforecast: forecastData.list.map((item: any) => ({
        time: WeatherService.getLocalCityTime(item.dt, data.timezone),
        temp: item.main.temp,
        state: WeatherService.mapWeatherIdToStateId(
          item.weather[0].id,
          item.sys.pod === 'd',
        ),
      })),
      moonPhase: MoonPhase.FullMoon,
      pressure: data.main.pressure,
      pressureUnits: PressureUnits.Pascal,
      state: WeatherService.mapWeatherIdToStateId(
        data.weather[0].id,
        data.dt > data.sys.sunrise && data.dt < data.sys.sunset,
      ),
      tempUnits: TempUnits.Celsius,
      windDirectionAngle: data.wind.deg,
      windSpeed: data.wind.speed,
      windSpeedUnits: WindSpeedUnits.Ms,
      currentTemp: data.main.temp,
      humidity: data.main.humidity,
      maxTemp: data.main.temp_max,
      minTemp: data.main.temp_min,
      shortDescription: data.weather[0].description,
      lastUpdated: data.dt,
      timezone: data.timezone,
      sunset: data.sys.sunset,
      sunrise: data.sys.sunrise,
    };
  }
  private static getLocalCityTime = (
    dt: number,
    timezoneOffsetSeconds: number,
  ): Date => {
    return new Date((dt + timezoneOffsetSeconds) * 1000);
  };
  private static getCaqi(airQualityData: any) {
    const CAQI_THRESHOLDS = {
      no2: [50, 100, 200, 400, Infinity],
      pm10: [25, 50, 90, 180, Infinity],
      o3: [60, 120, 180, 240, Infinity],
      pm2_5: [15, 30, 55, 110, Infinity],
    } as const;
    const getSubIndex = (
      value: number,
      pollutant: keyof typeof CAQI_THRESHOLDS,
    ): number => {
      if (value <= CAQI_THRESHOLDS[pollutant][0]) {
        return 0;
      } // Very Low
      if (value <= CAQI_THRESHOLDS[pollutant][1]) {
        return 25;
      } // Low
      if (value <= CAQI_THRESHOLDS[pollutant][2]) {
        return 50;
      } // Medium
      if (value <= CAQI_THRESHOLDS[pollutant][3]) {
        return 75;
      } // High
      return 100; // Very High
    };
    const {no2, pm10, o3, pm2_5} = airQualityData.list[0].components;

    const subIndices = [
      getSubIndex(no2, 'no2'),
      getSubIndex(pm10, 'pm10'),
      getSubIndex(o3, 'o3'),
      getSubIndex(pm2_5, 'pm2_5'),
    ];

    return Math.max(...subIndices);
  }

  private static mapWeatherIdToStateId(
    weatherId: number,
    isDay: boolean = true,
  ): WeatherId {
    const states: [number, number, WeatherId][] = [
      [200, 232, WeatherId.thunderstorm],
      [300, 321, WeatherId.drizzle],
      [500, 531, WeatherId.rain],
      [600, 622, WeatherId.snow],
      [700, 700, WeatherId.mist],
      [711, 711, WeatherId.smoke],
      [721, 721, WeatherId.haze],
      [731, 731, WeatherId.dust],
      [741, 741, WeatherId.fog],
      [751, 751, WeatherId.sand],
      [761, 761, WeatherId.dust],
      [762, 762, WeatherId.ash],
      [771, 771, WeatherId.squall],
      [781, 781, WeatherId.tornado],
      [800, 800, WeatherId.clearDay],
      [801, 804, WeatherId.cloudsDay],
    ];
    const [_, __, state] = states.find(
      ([min, max]) => weatherId >= min && weatherId <= max,
    ) || [0, 0, WeatherId.clearDay];
    if (state === WeatherId.clearDay && !isDay) {
      return WeatherId.clearNight;
    }
    if (state === WeatherId.cloudsDay && !isDay) {
      return WeatherId.cloudsNight;
    }
    return state;
  }
  private static LUNAR_CYCLE_DAYS = 29.53058770576;
  private static KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z').getTime();

  private static MOON_PHASE_BOUNDARIES: {
    min: number;
    max: number;
    phase: MoonPhase;
  }[] = [
      {min: 0, max: 1, phase: MoonPhase.NewMoon},
      {min: 1, max: 6.382, phase: MoonPhase.WaxingCrescent},
      {min: 6.382, max: 8.382, phase: MoonPhase.FirstQuarter},
      {min: 8.382, max: 13.765, phase: MoonPhase.WaxingGibbous},
      {min: 13.765, max: 15.765, phase: MoonPhase.FullMoon},
      {min: 15.765, max: 21.148, phase: MoonPhase.WaningGibbous},
      {min: 21.148, max: 23.148, phase: MoonPhase.ThirdQuarter},
      {min: 23.148, max: 28.53, phase: MoonPhase.WaningCrescent},
    ];
  private static getMoonPhase = (date: Date = new Date()): MoonPhase => {
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date provided.');
    }
    const currentTime = date.getTime();
    const daysSinceKnownNewMoon =
      (currentTime - WeatherService.KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);

    const currentCyclePosition =
      daysSinceKnownNewMoon % WeatherService.LUNAR_CYCLE_DAYS;

    const matchingPhase = WeatherService.MOON_PHASE_BOUNDARIES.find(
      ({min, max}) => currentCyclePosition >= min && currentCyclePosition < max,
    );
    return matchingPhase ? matchingPhase.phase : MoonPhase.NewMoon;
  };
}

export default WeatherService;
