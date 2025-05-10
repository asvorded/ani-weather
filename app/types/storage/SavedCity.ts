import { Coords } from '../common/Coords';

export type SavedCity = {
  // identifier
  coords: Coords;

  name: string;
  region: string;
  country: string;
  isGeolocation?: true;
}
