import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  defaultFont: {
    fontFamily: 'BellotaText-Regular',
  },
  backButton: {
    marginLeft: 15,
    marginTop: 8,
    marginBottom: 8,
  },

  refreshContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIndicator: {
    width: 96,
    height: 96,
  },

  messagesList: {
    paddingHorizontal: 15,
    marginBottom: 8,
  },
  messagesListFooter: {
    height: 10,
  },
  messagesListSeparator: {
    height: 10,
  },
  messageContainer: {
    borderRadius: 15,
    padding: 15,
  },

  noContentText: {
    textAlign: 'center',
  },
});

export const lightStyles = StyleSheet.create({
  defaultText: {
    color: 'black',
  },
  defaultBackground: {
    backgroundColor: 'white',
  },
  messageContainer: {
    backgroundColor: '#e6e8fd',
  },
  refreshIndicator: {
    color: '#4b77d1',
  },
  noContentText: {
    color: 'gray',
  },
});

export const darkStyles = StyleSheet.create({
  defaultText: {
    color: 'white',
  },
  defaultBackground: {
    backgroundColor: 'black',
  },
  messageContainer: {
    backgroundColor: '#393939',
  },
  refreshIndicator: {
    color: '#ededed',
  },
  noContentText: {
    color: '#dedede',
  },
});


