import {
  ActivityIndicator, FlatList,
  GestureResponderEvent, Image,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useState } from 'react';

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
import { FoundCityProps, PopularCityProps, SavedCitiesProps, SavedCityProps } from './TownSelect.types';
import { SavedCity } from '../../types/storage/SavedCity';

import BackImg from '../../../assets/icons/back-custom.svg';
import FindLocationImg from '../../../assets/icons/location.svg';
import LocationDarkImg from '../../../assets/icons/location-filled-dark.svg';
import DeleteDarkImg from '../../../assets/icons/delete-dark.svg';
import { SavedCitiesService } from '../../services/SavedCitiesService';
import { PagesNames } from '../../types/common/root-stack-params-list';
import { useSavedCities } from '../../hooks/useSavedCities';

function isQueryLongEnough(query: string): boolean {
  return query.length >= 3;
}

const SavedCityBlock = ({
  city, isLocation, onDeleteSavedCityClick,
}: SavedCityProps) => {
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
        <TouchableOpacity onPress={() => onDeleteSavedCityClick(city)}>
          <DeleteDarkImg
            width={deleteWidth} height={deleteHeight}
            style={styles.savedCityDeleteIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const SavedCitiesList = ({
  savedCities, onDeleteSavedCityClick,
}: SavedCitiesProps) => {
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
              city={city.savedCity}
              isLocation={false}
              onDeleteSavedCityClick={onDeleteSavedCityClick}
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

const PopularCity = ({
  city, onClick,
}: PopularCityProps) => {
  return (
    <TouchableOpacity
      style={styles.popularCity}
      onPress={() => { onClick(city); }}
    >
      <Text style={[styles.defaultFont, styles.popularCityText]}>{city.name}</Text>
    </TouchableOpacity>
  );
};

const FoundCities = ({
  foundCities,
  onFoundCityClick,
}: FoundCityProps) => {
  const insets = useSafeAreaInsets();

  return (
    <FlatList
      data={foundCities}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => (
        <TouchableOpacity style={styles.foundCity} onPress={() => onFoundCityClick(item)}>
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
  const {t, i18n} = useTranslation();
  const navigation = useCustomNavigation();
  const insets = useSafeAreaInsets();

  const {savedCities} = useSavedCities();

  const [popularCities, setPopularCities] = useState<FoundCity[]>([]);
  const [foundCities, setFoundCities] = useState<FoundCity[]>([]);
  const [query, setQuery] = useState('');

  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get and filter popular cities on start
  useEffect(() => {
    let popularCities = getPopularCities();
    popularCities = popularCities.filter((city) =>
      savedCities.every((sc) =>
        sc.savedCity.coords.lat !== city.latitude && sc.savedCity.coords.long !== city.longitude
      )
    );

    setPopularCities(popularCities);
  }, [savedCities]);

  // Filter and find cities
  function processQueryAsync(query: string) {
    if (errorMessage != null) {
      hideLocationError();
    }

    setQuery(query);
    query = query.trim();

    setFoundCities(filterCitiesByQuery(foundCities, query));

    if (isQueryLongEnough(query)) {
      const lang = i18n.language;
      findCitiesWithTimeout(query, lang, (foundCities) => {
        setFoundCities(foundCities);
      });
    }
  }

  // Find geolocation click hadler
  function onFindLocationClick() {
    setIsFindingLocation(true);
    setErrorMessage(null);

    findLocationWithCallbacks((position) => {
      setIsFindingLocation(false);
      // TODO: Goto to main screen with found location
    }, (error) => {
      setIsFindingLocation(false);

      switch (error.code) {
      case error.PERMISSION_DENIED:
        setErrorMessage(t('townSelect.location.errors.permissionDenied'));
        break;
      case error.POSITION_UNAVAILABLE:
        setErrorMessage(t('townSelect.location.errors.positionUnavailable'));
        break;
      default:
        setErrorMessage(t('townSelect.location.errors.default'));
        break;
      }
    }, 15_000);
  }

  // Hide location error
  function hideLocationError() {
    setErrorMessage(null);
  }

  // Get forecast, save city and go to Home page
  function onFoundCityClick(foundCity: FoundCity) {
    SavedCitiesService.addCity(foundCity)
      .then(() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.replace(PagesNames.Home);
        }
      })
      .catch((err) => {
        setErrorMessage(t('townSelect.addError'));
        console.error(`Unable to add city: ${err.message}`);
      });
  }

  // Add popular city and go to Home page
  function onPopularCityClick(foundCity: FoundCity) {
    onFoundCityClick(foundCity);
  }

  // Delete saved city
  function onDeleteCity(city: SavedCity) {
    SavedCitiesService.removeCityByCoords(city.coords);
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

      {/* Error message */}
      {errorMessage ? (
        <View style={styles.locationErrorContainer} key="location_error">
          <Text
            style={[styles.locationErrorText, styles.defaultFont]}
          >{errorMessage}</Text>
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
      <View style={styles.citiesContainer} key="main content">
        {query.length > 0 ? (
          // Found cities
          <FoundCities
            foundCities={foundCities}
            onFoundCityClick={onFoundCityClick}
          />
        ) : (
          <View>
            {/* Popular cities */}
            <View key="popular cities">
              <Text style={[styles.popularCitiesText, styles.defaultFont]}>{t('townSelect.popularCities')}</Text>
              <View style={styles.popularCitiesContainer}>{
                popularCities.map((city, index) => (
                  <PopularCity key={index} city={city} onClick={onPopularCityClick}/>
                ))
              }</View>
            </View>

            {/* Saved cities */}
            <SavedCitiesList
              savedCities={savedCities}
              onDeleteSavedCityClick={onDeleteCity}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default TownSelect;
