import {ScrollView, View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import { styles } from './Home.styles.ts';
import { CustomText } from '../../components/CustomText/CustomText.tsx';
import { WeatherDetailedPanelProps } from './Home.types.ts';


const WeatherDetailedPanel = ({
  color,
  title,
  text,
  contentElement,
}: WeatherDetailedPanelProps) => {
  return (
    <View style={styles.cell}>
      <View style={[styles.detailsPanel, { backgroundColor: color }]}>
        <View style={styles.detailsPanelContentWrapper}>
          {contentElement}
        </View>
        <View style={styles.detailsTextPanel}>
          <CustomText style={styles.detailsPanelTitle}>{title}</CustomText>
          <CustomText style={styles.detailsPanelText}>{text}</CustomText>
        </View>
      </View>
    </View>
  );
};

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
            <WeatherDetailedPanel
              color="#A9E78888"
              title="Фаза луны"
              text="Первая четверть"
              contentElement={<CustomText>Test</CustomText>}
            />
            <WeatherDetailedPanel
              color="#B3DBFF88"
              title="Фаза луны"
              text="Полнолуние"
              contentElement={<></>}
            />
          </View>
          <View style={styles.row}>
            <WeatherDetailedPanel
              color="#FFE17988"
              title="Фаза луны"
              text="Полнолуние"
              contentElement={<></>}
            />
            <WeatherDetailedPanel
              color="#FBB9BA88"
              title="Фаза луны"
              text="Полнолуние"
              contentElement={<></>}
            />
          </View>
          <View style={styles.row}>
            <WeatherDetailedPanel
              color="#FF9A7988"
              title="Фаза луны"
              text="Полнолуние"
              contentElement={<></>}
            />
            <WeatherDetailedPanel
              color="#B9F4FB88"
              title="Фаза луны"
              text="Полнолуние"
              contentElement={<></>}
            />
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
