import {Languages} from './Languages.ts';
import {PressureUnits, TempUnits} from '../api/Forecast.ts';

export type UserSettings = {
  language: Languages;
  temperature: TempUnits;
  pressure: PressureUnits;
  notifications: boolean;
};
