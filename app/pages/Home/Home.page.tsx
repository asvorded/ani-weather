import {ScrollView, View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import { styles } from './Home.styles.ts';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { CustomText } from '../../components/CustomText/CustomText.tsx';

const HomePage = ()=> {
  let { t } = useTranslation();

  return (
    <View style={styles.outerContainer}>
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
      </ScrollView>
    </View>
  );
};
export default HomePage;
