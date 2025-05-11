import { WeatherModule } from '../../specs/NativeModules';
import { ShortForecast } from '../types/widgets/ShortForecast';

export namespace WidgetService {
  export function setForecastOnWidget(forecast: ShortForecast) {
    WeatherModule.setForecastOnWidget(forecast);
  }

  export function resetWidget() {
    WeatherModule.resetWidget();
  }
}
