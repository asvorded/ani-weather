import { WeatherId } from '../api/Forecast';

export type ShortForecast = {
	name: string,
  state: WeatherId,
	currentTemp: number,
	maxTemp: number,
	minTemp: number,
  time: number,
}
