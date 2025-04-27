import { PressureUnits, WindSpeedUnits } from '../../types/api/Forecast';

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
