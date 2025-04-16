import {ImageBackground, ScrollView, TouchableOpacity, View} from 'react-native';
import React, {StrictMode} from 'react';
import {useTranslation} from 'react-i18next';
import { styles } from './Home.styles.ts';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { CustomText } from '../../components/CustomText/CustomText.tsx';
import { PagesNames } from '../../types/common/root-stack-params-list.ts';
import { useCustomNavigation } from '../../hooks/useCustomNavigation.ts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomePage = ()=> {
  let { t } = useTranslation();
  const navigation = useCustomNavigation();
  const insets = useSafeAreaInsets();

  return (
    <StrictMode>
      <ImageBackground
        source={require('./../../../assets/images/sample_1920×1280.png')}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topContainer} >
            <MaskedView
              maskElement={
                <LinearGradient
                  style={styles.mask}
                  colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0.0)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  locations={[0, 1]}
                />
              }
            >
              <CustomText style={styles.temperatureMain}>10°C</CustomText>
            </MaskedView>
          </View>
          <View style={styles.detailsGrid}>
            <View style={styles.row}>
              <View style={styles.cell}>
                <View style={styles.detailsPanel} />
              </View>
              <View style={styles.cell}>
                <View style={styles.detailsPanel} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <View style={styles.detailsPanel} />
              </View>
              <View style={styles.cell}>
                <View style={styles.detailsPanel} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <View style={styles.detailsPanel} />
              </View>
              <View style={styles.cell}>
                <View style={styles.detailsPanel} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <View style={styles.forecastPanel} />
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate(PagesNames.TownSelect)}>
            <View style={{ backgroundColor: 'white' }}><CustomText>Go to TownSelect</CustomText></View>
          </TouchableOpacity>
          <View style={{ width: 200, height: insets.bottom }}/>
        </ScrollView>
      </ImageBackground>
    </StrictMode>
  );
};
export default HomePage;
