import {ScrollView, View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

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

const WeatherPanel = () => {
  return (
    <View style={styles.topContainer}>
      <View style={styles.cityWrapper}>
        <CustomText style={styles.cityText}>Минск</CustomText>
      </View>
      <View style={styles.weatherMainContainer}>
        <View />
        <CustomText style={styles.temperatureMain}>10°C</CustomText>
      </View>
      <View style={styles.weatherDescriptionContainer}>
        <CustomText style={styles.weatherDescriptionText}>Переменная облачность</CustomText>
        <CustomText style={styles.temperatureAmplitudeText}>15°/7°</CustomText>
      </View>
    </View>
  );
};

const MoonPhaseComponent = () => {
  return (
    <View style={styles.moonPhaseComponent} />
  );
};

const HomePage = ()=> {
  let { t } = useTranslation();

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <WeatherPanel />
        <View style={styles.detailsGrid}>
          <View style={styles.row}>
            <WeatherDetailedPanel
              color="#A9E78888"
              title="Фаза луны"
              text="Первая четверть"
              contentElement={<MoonPhaseComponent />}
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
