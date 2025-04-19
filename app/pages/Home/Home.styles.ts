import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FAE3D2',
  },
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
    display: 'flex',
    gap: 20,
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
    gap: 20,
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    flexBasis: 'auto',
    flexGrow: 1,
  },
  detailsPanel:{
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    width: '100%',
    height: 100,
    backgroundColor: '#A9E788',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  forecastPanel:{
    width: '100%',
    borderRadius: 20,
    height: 100,
    backgroundColor: '#A9E788',
    borderWidth: 1,
    borderStyle: 'solid',
  },
});
