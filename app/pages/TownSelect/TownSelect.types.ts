import { FoundCity } from '../../types/api/FoundCity';
import { SavedCity } from '../../types/storage/SavedCity';

export type FoundCityProps = {
  foundCities: FoundCity[];
}

export type SavedCityProps = {
  city: SavedCity;
  isLocation: boolean;
}

export type SavedCitiesProps = {
  savedCities: SavedCity[];
}
