import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  settingsPanel: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 24,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#fff',
    backgroundColor: 'rgba(0, 32, 129, 0.6)',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  pickerItem: {
    color: '#a30000',
    backgroundColor: '#7f0098',
    fontFamily: 'BellotaText-Regular',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  text: {
    fontFamily: 'BellotaText-Regular',
  },
});
