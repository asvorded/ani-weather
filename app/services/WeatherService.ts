import axios from 'axios';
import {
  Forecast,
  MoonPhases,
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

  public static async fetchWeatherByCity(city: string): Promise<Forecast> {
    console.log(WeatherService.API_KEY, WeatherService.currentWeatherOWUrl, WeatherService.forecastWeatherOWUrl);
    try {
      const [currentWeatherResponse, forecastResponse] = await Promise.all([
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
      ]);

      return WeatherService.mapDataToForecast(
        currentWeatherResponse.data,
        forecastResponse.data,
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
      const [currentWeatherResponse, forecastResponse] = await Promise.all([
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
      ]);

      return WeatherService.mapDataToForecast(
        currentWeatherResponse.data,
        forecastResponse.data,
      );
    } catch (error: any) {
      throw new Error(`Ошибка: ${error.response?.statusText || error.message}`);
    }
  }

  private static mapDataToForecast(data: any, forecastData: any): Forecast {
    return {
      airQuality: 0,
      geomagneticActivity: 0,
      hourlyforecast: forecastData.list.map((item: any) => ({
        time: new Date(item.dt * 1000),
        temp: item.main.temp,
        state: WeatherService.mapWeatherIdToStateId(item.weather[0].id),
      })),
      moonPhase: MoonPhases.FullMoon,
      pressure: data.main.pressure,
      pressureUnits: PressureUnits.Pascal,
      state: WeatherService.mapWeatherIdToStateId(data.weather[0].id),
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
    };
  }

  private static mapWeatherIdToStateId(weatherId: number): WeatherId {
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
      [800, 800, WeatherId.clear],
      [801, 804, WeatherId.clouds],
    ];
    const [state] = states.find(
      ([min, max]) => weatherId >= min && weatherId <= max,
    ) || [0, 0, WeatherId.clear];
    return state;
  }
}

export default WeatherService;
