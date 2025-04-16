import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamsList } from '../types/common/root-stack-params-list';

export function useCustomNavigation() {
  return useNavigation<NativeStackNavigationProp<RootStackParamsList>>();
}
