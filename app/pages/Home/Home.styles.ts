import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 25,
    width: '100%',
    //height: '100%',
    // backgroundColor: '#FAE3D2',
    flexDirection: 'column',
    alignItems: 'center',
  },
  menuButton:{
    position: 'absolute',
    backgroundColor: 'transparent',
    color: 'black',
  },
  topContainer: {
    backgroundColor: 'transparent',
    height: 200,
    width: '100%',
  },
  detailsGrid:{
    width: '100%',
  },
  city: {
    fontFamily: 'BellotaText-Regular',
    fontSize: 24,
    color: 'black',
    backgroundColor: 'transparent',
  },
  temperatureMain: {
    // fontFamily: 'BellotaText-Regular',
    fontSize: 70,
  },
  mask: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    flexBasis: 'auto',
    flexGrow: 1,
  },
  detailsPanel:{
    borderRadius: 20,
    width: 150,
    height: 100,
    margin: 20,
    backgroundColor: '#A9E788',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  forecastPanel:{
    borderRadius: 20,
    width: 340,
    height: 100,
    margin: 20,
    backgroundColor: '#A9E788',
    borderWidth: 1,
    borderStyle: 'solid',
  },

});
