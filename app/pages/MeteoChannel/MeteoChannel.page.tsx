import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { darkStyles, lightStyles, styles } from './MeteoChannel.styles';
import { getLastMessagesAsync } from '../../services/MeteoChannelService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SystemBars } from 'react-native-edge-to-edge';
import { useCustomNavigation } from '../../hooks/useCustomNavigation';

import BackImg from '../../../assets/icons/back-custom.svg';
import BackLightImg from '../../../assets/icons/back-light.svg';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { CustomText } from '../../components/CustomText/CustomText';

const MeteoChannel = () => {
  const insets = useSafeAreaInsets();
  const navigation = useCustomNavigation();
  const {t} = useTranslation();
  const colorScheme = useColorScheme();

  const colorStyles = colorScheme === 'light' ? lightStyles : darkStyles;
  const controlsColor = colorScheme === 'light' ? '#4b77d1' : 'white';

  const [messages, setMessages] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(true);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    getLastMessagesAsync(5)
      .then((messages) => {
        setMessages(messages);
      })
      .finally(() => {
        setRefreshing(false);
      });

  }, []);

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <View style={[
      styles.screen, colorStyles.defaultBackground,
      {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      },
    ]}>
      <SystemBars style="auto" />

      <TouchableOpacity key="back" style={styles.backButton} onPress={() => { navigation.goBack(); }}>
        {colorScheme === 'light' ? (
          <BackImg width={36} height={36} color={controlsColor}/>
        ) : (
          <BackLightImg width={36} height={36}/>
        )}
      </TouchableOpacity>
      {refreshing ? (
        <View style={styles.refreshContainer}>
          <ActivityIndicator style={styles.refreshIndicator} color={controlsColor}/>
        </View>
      ) : (
        <FlatList
          key="messages list"
          contentContainerStyle={styles.messagesList}
          data={messages}
          inverted
          renderItem={({item}) => (
            <View style={[styles.messageContainer, colorStyles.messageContainer]}>
              <Text style={[styles.defaultFont, colorStyles.defaultText]}>{item}</Text>
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ItemSeparatorComponent={() => (
            <View style={styles.messagesListSeparator}/>
          )}
          ListEmptyComponent={
            <Text style={[styles.noContentText, colorStyles.noContentText]}>{t('meteoChannel.noContent')}</Text>
          }
          ListHeaderComponent={<View style={styles.messagesListFooter}/>}/>
      )}
    </View>
  );
};

export default MeteoChannel;
