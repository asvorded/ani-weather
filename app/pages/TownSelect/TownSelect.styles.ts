import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  defaultFont: {
    fontFamily: 'BellotaText-Regular',
  },
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
  locationImage: {
    width: '100%',
    height: '100%',
    color: '#4B77D1',
  },
  citiesContainer: {
    marginVertical: 20,
  },
  popularCitiesText: {
    marginHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  popularCitiesContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  popularCity: {
    marginRight: 10,
    marginBottom: 10,

    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
    backgroundColor: '#d9d9d9',
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
    backgroundColor: 'lightgray',
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
    width: 35,
    height: 35,
  },
  locationErrorCloseIcon: {
    width: '100%',
    height: '100%',
  },
});
