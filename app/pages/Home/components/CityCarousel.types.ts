import { StyleProp, ViewStyle } from 'react-native';
import { SavedCity } from '../../../types/storage/SavedCity';

export type CityCarouselProps = {
  cities: SavedCity[];
  onChange?: (city: SavedCity) => void;
  style?: StyleProp<ViewStyle>;
}
