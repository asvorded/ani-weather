import { Coords } from '../common/Coords';

export type SavedCity = {
  // identifier
  coords: Coords;
  isLocation?: boolean;
  name: string;
  region: string;
  country: string;
  isGeolocation?: true;
}
