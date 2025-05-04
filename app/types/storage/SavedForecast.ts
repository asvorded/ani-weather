import { Forecast } from '../api/Forecast';
import { Coords } from '../common/Coords';

export type SavedForecast = Forecast;

export type SavedForecastWithCityCoords = {
  cityCoords: Coords;
  forecast: SavedForecast;
};
