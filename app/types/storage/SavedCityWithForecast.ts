import { SavedCity } from './SavedCity';
import { SavedForecast } from './SavedForecast';

export type SavedCityWithForecast = {
  savedCity: SavedCity;
  forecast?: SavedForecast;
}
