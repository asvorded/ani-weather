import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 15,
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
