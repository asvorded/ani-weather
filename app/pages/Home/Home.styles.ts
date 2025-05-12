import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
    //flex: 1,
    backgroundColor: '#fae3d2',
  },

  // System views
  systemStatusBar: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#1b1b1b',
    opacity: 0.2,
  },
  systemNavButtons: {
    width: '100%',
    backgroundColor: '#1b1b1b',
    opacity: 0.2,
  },

  // Screen container
  imageContainer: {
    height: '100%',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'column',
    alignItems: 'center',
  },

  // Actions panel
  actionsPanel: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 7,
  },
  actionButtonIcon: {
    width: 44,
    height: 44,
  },
  actionButton: {
    padding: 3,
  },

  topContainer: {
    marginTop: 0,
    marginBottom: 20,
    width: '100%',
  },
  detailsGrid:{
    width: '100%',
    display: 'flex',
    gap: 20,
  },
  weatherMainContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherDescriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityWrapper: {
    flexDirection: 'row',
  },
  weatherDescriptionText: {
    fontSize: 16,
  },
  temperatureMain: {
    fontSize: 70,
  },
  temperatureAmplitudeText: {
    fontSize: 20,
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
    flexBasis: 1,
    flexGrow: 1,
  },
  detailsPanel:{
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    width: '100%',
    height: 140,
    backgroundColor: '#A9E788',
    borderWidth: 0.75,
    borderColor: '#656565',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  detailsPanelContentWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  detailsTextPanel: {
    width: '100%',
    flexDirection: 'column',
  },
  detailsPanelTitle: {
    width: '100%',
    fontSize: 12,
    marginBottom: -4,
  },
  detailsPanelText: {
    width: '100%',
    fontSize: 18,
  },
  forecastPanel: {
    width: '100%',
    borderRadius: 20,
    height: 150,
    backgroundColor: '#CEBBFF88',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  moonPhaseComponent: {
    height: 65,
    width: 65,
    borderRadius: '50%',
    backgroundColor: '#F7F7F7',
  },
  magneticActivityComponent: {
    height: 65,
    width: 65,
    position: 'relative',
  },
  magneticActivityText: {
    fontSize: 30,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -10 },//May break, cant use "translate(-50%, -50%)"
      { translateY: -20},
    ],
    lineHeight: 40,
  },
  humidityComponent: {
    height: 65,
    width: 65,
    backgroundColor: '#D9D9D9',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  humidityText: {
    fontSize: 15,
    lineHeight: 20,
  },
  pressureComponent: {
    height: 65,
    width: 65,
    backgroundColor: '#FFE6CD',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressureText: {
    marginBottom: -5,
    fontSize: 15,
    lineHeight: 20,
  },
  pressureUnits: {
    fontSize: 10,
    lineHeight: 15,
  },
  windComponent: {
    height: 65,
    width: 65,
    borderRadius: '50%',
    backgroundColor: '#FFF7E2',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  windCompassImg: {
    height: 52,
    width: 52,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
  },
  windCompassArrowImg: {
    height: 30,
  },
  tabBar: {
    backgroundColor: 'transparent',
  },
  tabBarText: {
    fontSize: 18,
  },
  citiesTabBarContainer: {
    marginTop: 15,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    gap: 5,
  },
  citiesTabBarTitle: {
    color: '#ffffff',
    fontSize: 20,
  },
  citiesTabBarDots: {
    flexDirection: 'row',
    gap: 4,
  },
  citiesTabBarDot: {
    width: 5,
    height: 5,
    margin: 2.5,
    borderRadius: '50%',
    backgroundColor: '#ffffff',
  },
  citiesTabBarDotInactive: {
    opacity: 0.5,
  },
});
