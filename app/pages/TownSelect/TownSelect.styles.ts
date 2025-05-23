import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1,
  },
  defaultFont: {
    fontFamily: 'BellotaText-Regular',
  },

  backButton: {
    marginTop: 8,
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,

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
  locationImage: {
    width: '100%',
    height: '100%',
    color: '#4b77d1',
  },

  citiesContainer: {
    marginVertical: 20,
  },

  // Saved city
  savedCityContainer: {
    marginBottom: 10,
  },
  savedCitiesTitle: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  savedCitiesNoCitiesText: {
    marginTop: 10,
    fontSize: 15,
    textAlign: 'center',
    color: 'gray',
  },
  savedCity: {
    marginTop: 10,
    borderRadius: 15,
    padding: 15,

    flexDirection: 'row',
    alignItems: 'center',
  },
  savedCityText: {
    fontSize: 18,
  },
  savedCityCountryText: {
    color: 'gray',
  },
  savedCityTextWhenSaved: {
    flex: 1,
  },
  savedCityLocationIcon: {
    width: 24,
    height: 24,
    marginLeft: 5,
  },
  savedCityDeleteIcon: {
    width: 24,
    height: 24,
    alignSelf: 'flex-end',
  },

  // Popular cities
  popularCitiesText: {
    marginHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  popularCitiesContainer: {
    marginBottom: 5,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularCity: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
  },
  popularCityText: {
    fontSize: 15,
  },

  foundCity: {
    display: 'flex',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  foundCityText: {
    fontSize: 16,
  },
  foundCityCountryText: {
    color: 'gray',
  },
  foundCitiesSeparator: {
    width: '100%',
    height: 1,
  },

  locationErrorContainer: {
    marginTop: 2,
    marginHorizontal: 30,
    backgroundColor: '#ff9393',
    position: 'relative',
    borderRadius: 10,
  },
  locationErrorText: {
    textAlign: 'center',
    color: 'white',
    marginHorizontal: 40,
    marginVertical: 12,
  },
  locationErrorClose: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  locationErrorCloseIcon: {
    width: '100%',
    height: '100%',
  },
});

export const lightStyles = StyleSheet.create({
  screen: {
    backgroundColor: 'white',
  },
  cityInput: {
    color: 'black',
  },
  inputContainer: {
    backgroundColor: '#f4f4f4',
  },
  foundCitiesSeparator: {
    backgroundColor: 'lightgray',
  },
  popularCity: {
    backgroundColor: '#d9d9d9',
  },
  savedCity: {
    backgroundColor: '#e5e0ff',
  },
});

export const darkStyles = StyleSheet.create({
  screen: {
    backgroundColor: 'black',
  },
  cityInput: {
    color: 'white',
  },
  inputContainer: {
    backgroundColor: '#363636',
  },
  foundCitiesSeparator: {
    backgroundColor: 'gray',
  },
  popularCity: {
    backgroundColor: '#595959',
  },
  savedCity: {
    backgroundColor: '#393939',
  },
});
