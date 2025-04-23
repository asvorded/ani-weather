import Geolocation,
{ GeolocationError, GeolocationResponse } from '@react-native-community/geolocation';

export function findLocationWithCallbacks(
  onSuccess: (position: GeolocationResponse) => void,
  onError: (error: GeolocationError) => void,
  timeout?: number,
) {
  Geolocation.requestAuthorization(() => {
    Geolocation.getCurrentPosition(onSuccess, onError,
      { timeout: timeout }
    );
  }, onError);
}
