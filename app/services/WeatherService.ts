import {
  Forecast,
  MoonPhases,
  PressureUnits,
  TempUnits,
  WindSpeedUnits,
} from '../types/api/Forecast.ts';
const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY; //not safe!!!
const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
export async function fetchWeatherByCity(city: string): Promise<Forecast> {
  const url = `${CURRENT_WEATHER_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=ru`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка : ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
  const forecastUrl = `${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=ru`;
  const forecastResponse = await fetch(forecastUrl);
  if (!forecastResponse.ok) {
    throw new Error(`Ошибка : ${forecastResponse.statusText}`);
  }
  const forecastData = await forecastResponse.json();
  console.log(forecastData);
  return mapDataToForecast(data, forecastData);
}
function mapDataToForecast(data: any, forecastData: any): Forecast {
  return {
    airQuality: 0,
    geomagneticActivity: 0,
    hourlyforecast: forecastData.list.map((item: any) => ({
      time: new Date(item.dt * 1000), // [x]: string or time?
      temp: item.main.temp,
      state: 0,
    })),
    moonPhase: MoonPhases.FullMoon, //TODO: change to calculate it based on date
    pressure: data.main.pressure,
    pressureUnits: PressureUnits.Pascal, //open weather supports only hPa https://openweathermap.org/weather-data
    state: 0,
    tempUnits: TempUnits.Celsius, //standard = Kelvin, metric = Celsius, imperial = Fahrenheit
    windDirectionAngle: data.wind.deg,
    windSpeed: data.wind.speed * 3.6,
    windSpeedUnits: WindSpeedUnits.Kmh, //standard, metric = m/s, imperial ml/h
    currentTemp: data.main.temp,
    humidity: data.main.humidity, // %
    maxTemp: data.main.temp_max,
    minTemp: data.main.temp_min,
    shortDescription: data.weather[0].description,
  };
}

export async function fetchWeatherByCoords(
  latitude: number,
  longitude: number,
): Promise<Forecast> {
  const url = `${CURRENT_WEATHER_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=ru`;
  console.log('awaiting fetch' + url);
  const response = await fetch(url);
  console.log('response' + response);
  if (!response.ok) {
    throw new Error(`Ошибка : ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
  const forecastUrl = `${FORECAST_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=ru`;
  const forecastResponse = await fetch(forecastUrl);
  if (!forecastResponse.ok) {
    throw new Error(`Ошибка : ${forecastResponse.statusText}`);
  }
  const forecastData = await forecastResponse.json();
  console.log(forecastData);
  return mapDataToForecast(data, forecastData);
}
