import {ScrollView, View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

import { styles } from './Home.styles.ts';
import { CustomText } from '../../components/CustomText/CustomText.tsx';
import { WeatherDetailedPanelProps } from './Home.types.ts';
import { WeatherIcon } from '../../components/WeatherIcon/WeatherIcon.tsx';
import { WeatherIconType } from '../../components/WeatherIcon/WeatherIcon.types.ts';
import MagneticActivityImg from '../../../assets/images/magnet_activity_5.svg';
import WindCompassImg from '../../../assets/images/compass.svg';
import WindCompassArrowImg from '../../../assets/images/compass_arrow.svg';

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
        <WeatherIcon type={WeatherIconType.PartlyCloudyDay} size={130} />
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

const MagneticActivityComponent = () => {
  return (
    <View style={styles.magneticActivityComponent}>
      <MagneticActivityImg height={65} width={65} />
      <CustomText style={styles.magneticActivityText}>5</CustomText>
    </View>
  );
};

const HumidityComponent = () => {
  return (
    <View style={styles.humidityComponent}>
      <CustomText style={styles.humidityText}>90%</CustomText>
    </View>
  );
};

const PressureComponent = () => {
  return (
    <View style={styles.pressureComponent}>
      <CustomText style={styles.pressureText}>1034</CustomText>
      <CustomText style={styles.pressureTextSmall}>mbar</CustomText>
    </View>
  );
};

const WindComponent = () => {
  return (
    <View style={styles.windComponent}>
      <WindCompassImg
        height={52}
        width={52}
        style={styles.windCompassImg}
      />
      <WindCompassArrowImg
        height={30}
        style={[styles.windCompassArrowImg, { transform: [{ rotate: '30deg' }] }]}
      />
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
              title="Геомагнитная активность"
              text="Слабая буря"
              contentElement={<MagneticActivityComponent />}
            />
          </View>
          <View style={styles.row}>
            <WeatherDetailedPanel
              color="#FFE17988"
              title="Влажность"
              text="Высокая"
              contentElement={<HumidityComponent />}
            />
            <WeatherDetailedPanel
              color="#FBB9BA88"
              title="Атмосферное давление"
              text="Повышенное"
              contentElement={<PressureComponent />}
            />
          </View>
          <View style={styles.row}>
            <WeatherDetailedPanel
              color="#FF9A7988"
              title="Ветер"
              text="14.8 км/ч (ЮЗ)"
              contentElement={<WindComponent />}
            />
            <WeatherDetailedPanel
              color="#B9F4FB88"
              title="Качество воздуха"
              text="Хорошее"
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
