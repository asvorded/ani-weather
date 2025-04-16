import { GestureResponderEvent, Image, StyleProp, StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';

import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { City } from '../../weather/models/City';
import { getPopularCitiesAsync } from '../../weather/api/cities/CitiesProvider';

const TownSelect = (props: { style?: StyleProp<ViewStyle> }) => {
  let { t } = useTranslation();

  const [ cities, setCities ] = useState<City[]>([]);

  getPopularCitiesAsync().then((cities) => {
    setCities(cities);
  });

  return (
    <View style={props.style}>
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

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: 10,

    backgroundColor: '#f4f4f4',
    borderColor: '#d0d0d0',
    borderWidth: 1,
    borderRadius: 150,
    boxShadow: '#9e9e9e 0 1 2',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  locationIcon: {
    width: 28,
    height: 28,
  },
  text: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  suggestedCities: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

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
