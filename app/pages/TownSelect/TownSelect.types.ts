import { FoundCity } from '../../types/api/FoundCity';
import { SavedCity } from '../../types/storage/SavedCity';
import { SavedCityWithForecast } from '../../types/storage/SavedCityWithForecast';

export type PopularCityProps = {
  city: FoundCity;
  onClick: (city: FoundCity) => void;
}

export type FoundCityProps = {
  foundCities: FoundCity[];
  onFoundCityClick: (foundCity: FoundCity) => void;
}

export type SavedCityProps = {
  city: SavedCity;
  isLocation: boolean;
  onDeleteSavedCityClick: (SavedCity: SavedCity) => void;
}

export type SavedCitiesProps = {
  savedCities: SavedCityWithForecast[];
  onDeleteSavedCityClick: (SavedCity: SavedCity) => void;
}
