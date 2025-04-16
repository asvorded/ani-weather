import {
  GestureResponderEvent, Image, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import { City } from '../../types/api/City';
import { getPopularCitiesAsync } from '../../services/CitiesProvider';
import { styles } from './TownSelect.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TownSelect = () => {
  let { t } = useTranslation();

  const [ cities, setCities ] = useState<City[]>([]);

  getPopularCitiesAsync().then((fetchedCities) => {
    setCities(fetchedCities);
  });

  const insets = useSafeAreaInsets();

  return (
    <View style={[
        {
          marginTop: insets.top,
          marginBottom: insets.bottom,
        },
        styles.screen,
      ]}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t('townSelect.textField.placeholder')}
          numberOfLines={1}
          />
        <Image
          style={styles.locationIcon}
          source={require('../../../assets/logos/location.png')}
        />
      </View>
      <Text style={styles.text}>{t('townSelect.popularCities')}</Text>
      <View>
        <View style={styles.suggestedCities}>{
          cities.map((city) => (
            <SuggestedCity key={city.id} name={city.name}/>
          ))
        }</View>
      </View>
    </View>
  );
};

const SuggestedCity = (
  props: { name: string,
  onPress?: ((event: GestureResponderEvent) => void) }
) => (
  <TouchableOpacity
    style={suggestedCityStyles.main}
    onPress={props.onPress}
  >
    <Text>{props.name}</Text>
  </TouchableOpacity>
);

const suggestedCityStyles = StyleSheet.create({
  main: {
    marginRight: 10,
    marginBottom: 10,

    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
    backgroundColor: '#d9d9d9',
  },
});

export default TownSelect;
