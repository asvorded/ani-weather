import { FoundCity } from '../../types/api/FoundCity';
import { SavedCity } from '../../types/storage/SavedCity';

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
  savedCities: SavedCity[];
  onDeleteSavedCityClick: (SavedCity: SavedCity) => void;
}
