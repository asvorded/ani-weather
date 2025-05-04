import {Languages} from './Languages.ts';
import {PressureUnits, TempUnits, WindSpeedUnits} from '../api/Forecast.ts';

export type UserSettings = {
  language: Languages;
  temperature: TempUnits;
  pressure: PressureUnits;
  windSpeed: WindSpeedUnits;
  notifications: boolean;
};
