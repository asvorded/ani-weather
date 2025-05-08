import {
  ActivityIndicator, FlatList,
  GestureResponderEvent, Image,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import { City } from '../../types/api/City';
import { filterCitiesByQuery, findCitiesWithTimeout,
  getPopularCities, getReadableCountry } from '../../services/CitiesService';
import { styles } from './TownSelect.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SystemBars } from 'react-native-edge-to-edge';
import { findLocationWithCallbacks } from '../../services/LocationService';

function isQueryLongEnough(query: string): boolean {
  return query.length >= 3;
}

const SavedCitiesList = (

) => {

}

const PopularCity = (
  props: {
    name: string,
    onPress?: ((event: GestureResponderEvent) => void)
  }
) => {
  return (
    <TouchableOpacity
      style={styles.popularCity}
      onPress={props.onPress}
    >
      <Text style={styles.defaultFont}>{props.name}</Text>
    </TouchableOpacity>
  );
};

const FoundCities = (
  props: {
    cities: City[]
  }
) => {
  const insets = useSafeAreaInsets();

  return (
    <FlatList
      data={props.cities}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => (
        <TouchableOpacity style={styles.foundCity}>
          <Text style={[
            styles.foundCityText,
            styles.defaultFont,
          ]}>{item.name}</Text>
          <Text style={[
            styles.foundCityCountryText,
            styles.defaultFont,
          ]}>{getReadableCountry(item)}</Text>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => (
        <View style={styles.foundCitiesSeparator}/>
      )}
      ListFooterComponent={(
        <View style={{height: insets.bottom}}/>
      )}
    />
  );
};

const TownSelect = () => {
  let { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const [ popularCities, setPopularCities ] = useState<City[]>([]);
  const [ foundCities, setFoundCities ] = useState<City[]>([]);
  const [ query, setQuery ] = useState('');

  const [ isFindingLocation, setIsFindingLocation ] = useState(false);
  const [ locationError, setLocationError ] = useState<string | null>(null);

  // Get popular cities only once
  useEffect(() => {
    setPopularCities(getPopularCities());
  }, []);

  // Filter and find cities
  function processQueryAsync(query: string) {
    if (locationError != null) {
      hideLocationError();
    }

    setQuery(query);
    query = query.trim();

    setFoundCities(filterCitiesByQuery(foundCities, query));

    if (isQueryLongEnough(query)) {
      findCitiesWithTimeout(query, (foundCities) => {
        setFoundCities(foundCities);
      });
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
      // TODO: Make error translations
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
        marginLeft: insets.left,
        marginRight: insets.right,
      },
      styles.screen,
    ]}>
      <SystemBars style="dark"/>

      <View style={styles.inputContainer} key="input">
        <TextInput
          style={[styles.input, styles.defaultFont]}
          placeholder={t('townSelect.textField.placeholder')}
          numberOfLines={1}
          value={query}
          onChange={({nativeEvent}) => {
            processQueryAsync(nativeEvent.text);
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
          <Text style={[styles.locationErrorText, styles.defaultFont]}>{t('townSelect.location.errorPrefix') + locationError}</Text>
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
          <FoundCities cities={foundCities} />
        ) : (
          <View>
            <Text style={[styles.popularCitiesText, styles.defaultFont]}>{t('townSelect.popularCities')}</Text>
            <View>
              <View style={styles.popularCitiesContainer}>{
                popularCities.map((city, index) => (
                  <PopularCity key={index} name={city.name}/>
                ))
              }</View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default TownSelect;
