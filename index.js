/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './app/App';
import {name as appName} from './app.json';

import i18next from 'i18next';

import ru from './i18n/locales/ru.json';
import en from './i18n/locales/en.json';
import {initReactI18next} from 'react-i18next';
import {registerNotificationBackgroundHandler} from './app/services/notifications/notifications';
import * as BackgroundForecastFetcherService from './app/services/background/BackgroundForecastFetcherService';

i18next.use(initReactI18next).init({
  lng: 'ru',
  fallbackLng: 'en',
  debug: true,
  resources: {
    ru: {
      translation: ru,
    },
    en: {
      translation: en,
    },
  },
});
// TODO: Move these to saved cities service
registerNotificationBackgroundHandler();

BackgroundForecastFetcherService.defineWeatherFetchTask();
BackgroundForecastFetcherService.registerWeatherFetchTask();

AppRegistry.registerComponent(appName, () => App);
