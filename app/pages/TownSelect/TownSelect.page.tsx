import {
  ActivityIndicator, FlatList,
  GestureResponderEvent, Image,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import { City } from '../../types/api/City';
import { filterCitiesByQuery, findCitiesAsync, getPopularCitiesAsync } from '../../services/CitiesProvider';
import { styles } from './TownSelect.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SystemBars } from 'react-native-edge-to-edge';
import { findLocationWithCallbacks } from '../../services/LocationService';

function isQueryLongEnough(query: string): boolean {
  return query.length >= 3;
}

let foundCities: City[] = [];

const TownSelect = () => {
  let { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const [ popularCities, setPopularCities ] = useState<City[]>([]);
  const [ showingFoundCities, setFoundCities ] = useState<City[]>([]);
  const [ query, setQuery ] = useState('');

  const [ isFindingLocation, setIsFindingLocation ] = useState(false);
  const [ locationError, setLocationError ] = useState<string | null>(null);

  // Get popular cities only once
  useEffect(() => {
    getPopularCitiesAsync()
      .then((fetchedCities) => {
        setPopularCities(fetchedCities);
      });
  }, []);

  // Filter and find cities
  async function processQueryAsync(query: string) {
    if (locationError != null) {
      hideLocationError();
    }

    setQuery(query);
    query = query.trim();

    setFoundCities(filterCitiesByQuery(foundCities, query));

    if (isQueryLongEnough(query)) {
      foundCities = await findCitiesAsync(query);
      setFoundCities(foundCities);
    }
  }

  // Find geolocation click hadler
  function onFindLocationClick() {
    setIsFindingLocation(true);
    setLocationError(null);

    findLocationWithCallbacks((position) => {
      setIsFindingLocation(false);
      // TODO: Goto to main screen with found location
    }, (error) => {
      setIsFindingLocation(false);
      setLocationError(error.message);
    }, 15_000);
  }

  // Hide location error
  function hideLocationError() {
    setLocationError(null);
  }

  return (
    <View style={[
      {
        marginTop: insets.top,
        marginBottom: insets.bottom,
      },
      styles.screen,
    ]}>
      <SystemBars style="dark"/>

      <View style={styles.inputContainer} key="input">
        <TextInput
          style={styles.input}
          placeholder={t('townSelect.textField.placeholder')}
          numberOfLines={1}
          value={query}
          onChange={async ({nativeEvent}) => {
            await processQueryAsync(nativeEvent.text);
          }}
          editable={!isFindingLocation}
        />

        <View style={styles.locationIcon}>
          {!isFindingLocation ? (
            <TouchableOpacity
              onPress={onFindLocationClick}
            >
              <Image
                style={styles.locationImage}
                source={require('../../../assets/icons/location.png')}
              />
            </TouchableOpacity>
          ) : (
            <ActivityIndicator
              style={styles.locationImage}
              size="small"
              color={styles.locationImage.color}
            />
          )}
        </View>
      </View>

      {locationError ? (
        <View style={styles.locationErrorContainer} key="location_error">
          <Text style={styles.locationErrorText}>{t('townSelect.location.errorPrefix') + locationError}</Text>
          <TouchableOpacity
            style={styles.locationErrorClose}
            onPress={hideLocationError}
          >
            <Image
              style={styles.locationErrorCloseIcon}
              source={require('../../../assets/icons/close.png')}
            />
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.citiesContainer} key="cities_list">
        {query.length > 0 ? (
          <FoundCities cities={showingFoundCities} />
        ) : (
          <View>
            <Text style={styles.popularCitiesText}>{t('townSelect.popularCities')}</Text>
            <View>
              <View style={styles.popularCitiesContainer}>{
                popularCities.map((city) => (
                  <PopularCity key={city.id} name={city.name}/>
                ))
              }</View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const PopularCity = (
  props: {
    name: string,
    onPress?: ((event: GestureResponderEvent) => void)
  }
) => (
  <TouchableOpacity
    style={styles.popularCity}
    onPress={props.onPress}
  >
    <Text>{props.name}</Text>
  </TouchableOpacity>
);

const FoundCities = (
  props: {
    cities: City[]
  }
) => (
  <FlatList
    data={props.cities}
    renderItem={({item}) => (
      <TouchableOpacity style={styles.foundCity}>
        <Text style={styles.foundCityText}>{item.name}</Text>
        <Text style={styles.foundCityCountryText}>{item.country}</Text>
      </TouchableOpacity>
    )}
    ItemSeparatorComponent={() => (
      <View style={styles.foundCitiesSeparator}/>
    )}
  />
);

export default TownSelect;
