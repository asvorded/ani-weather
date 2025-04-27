export enum MoonPhases {
  NewMoon,
  FirstHalf,
  FullMoon,
  LastHalf
}

export enum TempUnits {
  Celsius, Kelvin, Farenheit
}

export enum PressureUnits {
  Pascal, MmHg
}

export enum WindSpeedUnits {
  Kmh, Ms
}

export type HourForecast = {
  time: string; // [x]: string or time?
  state: number; // TODO: state type
  temp: number;
}


export type Forecast = {
  currentTemp: number;
  tempUnits: TempUnits,
  state: number; // TODO: state type
  shortDescription: string;
  maxTemp: number;
  minTemp: number;
  moonPhase: MoonPhases;
  geomagneticActivity: number;
  humidity: number;
  pressure: number;
  pressureUnits: PressureUnits,
  windSpeed: number;
  windSpeedUnits: WindSpeedUnits,
  windDirectionAngle: number;
  airQuality: number;
  hourlyforecast: HourForecast[];
}
