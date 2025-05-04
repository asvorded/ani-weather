import { Forecast } from '../api/Forecast';
import { Coords } from '../common/Coords';

export type SavedForecast = {
  cityCoords: Coords;
  forecast: Forecast;
};
