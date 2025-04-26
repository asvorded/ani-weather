export type HourForecast = {
  time: string; // [x]: string or time?
  state: number; // TODO: state type
  temp: number;
}

export enum MoonPhases {
  NewMoon,
  FirstHalf,
  FullMoon,
  LastHalf
}

export type Forecast = {
  currentTemp: number;
  state: number; // TODO: state type
  shortDescription: string;
  maxTemp: number;
  minTemp: number;
  moonPhase: MoonPhases;
  geomagneticActivity: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirectionAngle: number;
  airQuality: number;
  hourlyforecast: HourForecast[];
}
