import {
  ActivityIndicator, FlatList,
  GestureResponderEvent, Image,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import { useCustomNavigation } from '../../hooks/useCustomNavigation';

import { FoundCity } from '../../types/api/FoundCity';
import {
  filterCitiesByQuery, findCitiesWithTimeout,
  getPopularCities, getReadableCountry,
} from '../../services/CitiesService';
import { styles } from './TownSelect.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SystemBars } from 'react-native-edge-to-edge';
import { findLocationWithCallbacks } from '../../services/LocationService';
import { FoundCityProps, SavedCitiesProps, SavedCityProps } from './TownSelect.types';
import { SavedCity } from '../../types/storage/SavedCity';

import BackImg from '../../../assets/icons/back-custom.svg';
import FindLocationImg from '../../../assets/icons/location.svg';
import LocationDarkImg from '../../../assets/icons/location-filled-dark.svg';
import DeleteDarkImg from '../../../assets/icons/delete-dark.svg';

function isQueryLongEnough(query: string): boolean {
  return query.length >= 3;
}

const SavedCityBlock = ({city, isLocation}: SavedCityProps) => {
  const locationWidth = styles.savedCityLocationIcon.width;
  const locationHeight = styles.savedCityLocationIcon.height;
  const deleteWidth = styles.savedCityDeleteIcon.width;
  const deleteHeight = styles.savedCityDeleteIcon.height;

  return (
    <View style={styles.savedCity}>
      <Text style={[
        styles.defaultFont, styles.savedCityText,
        isLocation ? null : styles.savedCityTextWhenSaved,
      ]}>{city.name}</Text>
      {isLocation ? (
        <LocationDarkImg
          width={locationWidth} height={locationHeight}
          style={styles.savedCityLocationIcon}
        />
      ) : (
        <TouchableOpacity onPress={() => {/* TODO */}}>
          <DeleteDarkImg
            width={deleteWidth} height={deleteHeight}
            style={styles.savedCityDeleteIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const SavedCitiesList = ({savedCities}: SavedCitiesProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.savedCityContainer}>
      <Text
        style={[styles.defaultFont, styles.savedCitiesTitle]}
      >{t('townSelect.savedCities.title')}</Text>
      {savedCities.length > 0 ? (
        <View>
          {savedCities.map((city, index) => (
            <SavedCityBlock
              key={`saved city ${index}`}
              city={city}
              isLocation={false}
            />
          ))}
        </View>
      ) : (
        <Text style={[
          styles.defaultFont,
          styles.savedCitiesNoCitiesText,
        ]}>{t('townSelect.savedCities.noCities')}</Text>
      )}
    </View>
  );
};

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
      <Text style={[styles.defaultFont, styles.popularCityText]}>{props.name}</Text>
    </TouchableOpacity>
  );
};

const FoundCities = ({
  foundCities,
}: FoundCityProps) => {
  const insets = useSafeAreaInsets();

  return (
    <FlatList
      data={foundCities}
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
  const { t } = useTranslation();
  const navigation = useCustomNavigation();
  const insets = useSafeAreaInsets();

  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);

  const [ popularCities, setPopularCities ] = useState<FoundCity[]>([]);
  const [ foundCities, setFoundCities ] = useState<FoundCity[]>([]);
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

      {/* Back button */}
      {navigation.canGoBack() ? (
        <TouchableOpacity key="back" onPress={() => { navigation.goBack(); }}>
          <BackImg width={36} height={36} color={'#4b77d1'}/>
        </TouchableOpacity>
      ) : null}

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

        {/* Find button */}
        <View style={styles.locationIcon}>
          {!isFindingLocation ? (
            <TouchableOpacity onPress={onFindLocationClick}>
              <FindLocationImg width={styles.locationIcon.width} height={styles.locationIcon.height} />
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

      {/* Location error */}
      {locationError ? (
        <View style={styles.locationErrorContainer} key="location_error">
          <Text
            style={[styles.locationErrorText, styles.defaultFont]}
          >{t('townSelect.location.errorPrefix') + locationError}</Text>
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

      {/* Main content */}
      <View style={styles.citiesContainer} key="cities_list">
        {query.length > 0 ? (
          <FoundCities foundCities={foundCities} />
        ) : (
          <View>
            {/* Popular cities */}
            <View key="popular cities">
              <Text style={[styles.popularCitiesText, styles.defaultFont]}>{t('townSelect.popularCities')}</Text>
              <View style={styles.popularCitiesContainer}>{
                popularCities.map((city, index) => (
                  <PopularCity key={index} name={city.name}/>
                ))
              }</View>
            </View>

            {/* Saved cities */}
            <SavedCitiesList savedCities={savedCities} />
          </View>
        )}
      </View>
    </View>
  );
};

export default TownSelect;
