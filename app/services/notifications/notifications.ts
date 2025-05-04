import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import {
  fetchCurrentWeatherByCity,
  fetchWeatherByCity,
} from '../WeatherService.ts';
import {Platform} from 'react-native';

const WEATHER_TASK = 'WEATHER_UPDATE_TASK';
export async function registerNotificationBackgroundHandler() {
  console.log('registerNotificationBackgroundHandler');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  if (Platform.OS === 'android') {
    const channel = await Notifications.setNotificationChannelAsync(
      'bel-weather-channel',
      {
        name: 'bel-weather-channel',
        importance: Notifications.AndroidImportance.DEFAULT,
      },
    );
    console.log('channel ', channel);
  }
  TaskManager.defineTask(WEATHER_TASK, async () => {
    console.log('Background task started');
    try {
      // Замените URL и параметры на данные вашего погодного API
      const weather = await fetchCurrentWeatherByCity('Minsk');

      // Составляем сообщение на основе полученной информации
      const weatherText = `Сегодня ${weather.shortDescription} при температуре ${weather.currentTemp}°C`;

      // Отправляем уведомление
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Ежедневное обновление погоды',
          body: weatherText,
        },
        trigger: null,
      });
      console.log('Notification was sent');
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
      console.error('Error getting weather in background:', error);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });
  try {
    await BackgroundFetch.registerTaskAsync(WEATHER_TASK, {
      minimumInterval: 60 * 60 * 24,
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log('Background task was registered');
  } catch (err) {
    console.error('Background task failed to register', err);
  }
}

export async function test() {
  const {status: existingStatus} = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const {status} = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Тестовое уведомление',
      body: 'Если вы видите это, значит уведомления работают!',
    },
    trigger: null,
  });
  TaskManager.isTaskRegisteredAsync(WEATHER_TASK).then(isRegistered => {
    console.log('Background task registered:', isRegistered);
  });
}
