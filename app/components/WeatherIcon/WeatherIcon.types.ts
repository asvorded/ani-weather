
export enum WeatherIconType {
  ClearDay = 'clear-day',
  ClearNight = 'clear-night',
  PartlyCloudyDay = 'partly-cloudy-day',
  PartlyCloudyNight = 'partly-cloudy-night',
  Cloudy = 'cloudy',
  Fog = 'fog',
  Rain = 'rain',
  Snow = 'snow',
  Sleet = 'sleet',
  Wind = 'wind',
  CloudyNight = 'cloudy-night',
}

export type WeatherIconProps = {
  type: WeatherIconType,
  size?: number,
};
