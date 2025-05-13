import React from 'react';

import { WeatherIconProps, WeatherIconType } from './WeatherIcon.types';
import PartlyCloudyImg from '../../../assets/images/weather_icons/cloudyDay.svg';

const getWeatherIconByType = (type: WeatherIconType) => {
  switch (type) {
  case WeatherIconType.PartlyCloudyDay:
    return PartlyCloudyImg;
  default:
    return PartlyCloudyImg;
  }
};

export const WeatherIcon: React.FC<WeatherIconProps> = ({ type, size = 20 }) => {
  const SelectedWeatherIcon = getWeatherIconByType(type);

  return (
    <SelectedWeatherIcon width={size} height={size} />
  );
};


