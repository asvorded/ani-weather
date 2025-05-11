import { PressureUnits, WindSpeedUnits } from '../../types/api/Forecast';
import { SavedCityWithForecast } from '../../types/storage/SavedCityWithForecast';

export type ActionsPanelProps = {
  navOnCitySelectClick: () => void;
  navOnSettingsClick: () => void;
  isDarkMode: boolean;
  topWindowInset: number;
}

export type WeatherDetailedPanelProps = {
  color: string;
  title: string;
  text: string;
  contentElement: React.ReactNode;
};

export type MagneticActivityProps = {
  degree: number;
}

export type HumidityProps = {
  humidity: number;
}

export type PressureProps = {
  pressure: number;
  units: PressureUnits;
}

export type WindProps = {
  speed: number;
  units: WindSpeedUnits;
  directionAngle: number;
}

export type WeatherPanelProps = {
  temp: number;
  icon: string;
  description: string;
  minTemp: number;
  maxTemp: number;
  tempUnits: string;
  stateId: number;
}

export type CitiesTabBarProps = {
  // citiesList: {
  //   title: string;
  //   item: Record<string, never>;
  // }[]
  citiesList: SavedCityWithForecast[];
  selectedCityIndex: number;
}
