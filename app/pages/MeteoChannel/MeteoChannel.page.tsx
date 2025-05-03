import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { styles } from './MeteoChannel.styles';
import { getLastMessagesAsync } from '../../services/MeteoChannelService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SystemBars } from 'react-native-edge-to-edge';

const MeteoChannel = () => {
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    getLastMessagesAsync(5)
      .then((messages) => {
        setMessages(messages);
      });

  }, []);

  return (
    <View style={[
      styles.screen,
      {
        marginTop: insets.top,
        marginBottom: insets.bottom,
        marginLeft: insets.left,
        marginRight: insets.right,
      },
    ]}>
      <SystemBars style="dark"/>

      <FlatList
        key="messages list"
        contentContainerStyle={styles.messagesList}
        data={messages}
        inverted
        renderItem={({item}) => (
          <View style={styles.messageContainer}>
            <Text style={styles.defaultFont}>{item}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => (
          <View style={styles.messagesListSeparator}/>
        )}/>
    </View>
  );
};

export default MeteoChannel;
