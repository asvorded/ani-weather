import { EdgeInsets } from 'react-native-safe-area-context';
import {
  HourForecast,
  MoonPhase,
  PressureUnits, TempUnits,
  WindSpeedUnits,
} from '../../types/api/Forecast';
import { SavedCityWithForecast } from '../../types/storage/SavedCityWithForecast';
import React from 'react';
import {SvgProps} from 'react-native-svg';

export type ActionsPanelProps = {
  navOnCitySelectClick: () => void;
  navOnSettingsClick: () => void;
  isDarkMode: boolean;
  windowInsets: EdgeInsets;
}

export type WeatherDetailedPanelProps = {
  color: string;
  title: string;
  text: string;
  contentElement: React.ReactNode;
};

export type SunsetSunriseProps = {
  Icon: React.FC<SvgProps>;
}

export type HumidityProps = {
  humidity: number;
}

export type PressureProps = {
  pressure: number;
  units: PressureUnits;
}
export type AqiProps = {
  aqi: number;
}
export type MoonProps = {
  phase: MoonPhase;
}
export type WindProps = {
  speed: number;
  units: WindSpeedUnits;
  directionAngle: number;
}

export type WeatherPanelProps = {
  temp: number;
  Icon: React.FC<SvgProps>;
  description: string;
  minTemp: number;
  maxTemp: number;
  tempUnits: string;
}
export type ForecastPanelProps = {
  hourlyForecast: HourForecast[];
  tempUnits: TempUnits;
  newTempUnits: TempUnits;
  color: string;
}

export type CitiesTabBarProps = {
  citiesList: SavedCityWithForecast[];
  selectedCityIndex: number;
}
