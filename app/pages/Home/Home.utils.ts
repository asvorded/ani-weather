import {MoonPhase, PressureUnits, TempUnits, WindSpeedUnits} from '../../types/api/Forecast';
const MOON_PHASE_TRANSLATIONS: Record<MoonPhase, string> = {
  [MoonPhase.NewMoon]: 'forecast.moonPhases.newMoon',
  [MoonPhase.WaxingCrescent]: 'forecast.moonPhases.waxingCrescent',
  [MoonPhase.FirstQuarter]: 'forecast.moonPhases.firstHalf',
  [MoonPhase.WaxingGibbous]: 'forecast.moonPhases.waxingGibbous',
  [MoonPhase.FullMoon]: 'forecast.moonPhases.fullMoon',
  [MoonPhase.WaningGibbous]: 'forecast.moonPhases.waningGibbous',
  [MoonPhase.ThirdQuarter]: 'forecast.moonPhases.lastHalf',
  [MoonPhase.WaningCrescent]: 'forecast.moonPhases.waningCrescent',
};

export const getReadableMoonPhaseId = (phase: MoonPhase): string => {
  return MOON_PHASE_TRANSLATIONS[phase] || 'forecast.moonPhases.default';
};
const moonPhaseIconMap = {
  [MoonPhase.NewMoon]: require('../../../assets/images/moon_phases/new-moon.png'),
  [MoonPhase.WaxingCrescent]:
    require('../../../assets/images/moon_phases/waxing-crescent.png'),
  [MoonPhase.FirstQuarter]:
require('../../../assets/images/moon_phases/first-quarter.png'),
  [MoonPhase.WaxingGibbous]:
require('../../../assets/images/moon_phases/waxing-gibbous.png'),
  [MoonPhase.FullMoon]: require('../../../assets/images/moon_phases/full-moon.png'),
  [MoonPhase.WaningGibbous]:
require('../../../assets/images/moon_phases/waning-gibbous.png'),
  [MoonPhase.ThirdQuarter]:
require('../../../assets/images/moon_phases/third-quarter.png'),
  [MoonPhase.WaningCrescent]:
require('../../../assets/images/moon_phases/waning-crescent.png'),
};
export const getMoonPhaseImagePath = (phase: MoonPhase): number => {
  return (
    moonPhaseIconMap[phase]
  );
};
export function getReadableGeomagneticDegreeId(degree: number): string {
  const geomagneticLevels = [
    {min: 0, max: 4, id: 'forecast.geomagnetic.weak'},
    {min: 5, max: 6, id: 'forecast.geomagnetic.medium'},
    {min: 7, max: 9, id: 'forecast.geomagnetic.strong'},
  ];

  const level = geomagneticLevels.find(
    ({min, max}) => degree >= min && degree <= max,
  );
  return level ? level.id : 'forecast.geomagnetic.default';
}

export function getReadableHumidityId(value: number): string {
  if (value < 0 || value > 100) {
    return 'forecast.humidity.default';
  }

  if (value < 40) {
    return 'forecast.humidity.low';
  }

  if (value <= 60) {
    return 'forecast.humidity.medium';
  }

  return 'forecast.humidity.high';
}

export function getReadablePressureId(
  value: number,
  units: PressureUnits,
): string {
  if (units === PressureUnits.Pascal) {
    if (value < 980) {
      return 'forecast.pressure.low';
    }
    if (value <= 1040) {
      return 'forecast.pressure.medium';
    }
    return 'forecast.pressure.high';
  }
  if (units === PressureUnits.MmHg) {
    if (value < 735) {
      return 'forecast.pressure.low';
    }
    if (value <= 780) {
      return 'forecast.pressure.medium';
    }
    return 'forecast.pressure.high';
  }
  return 'forecast.pressure.default';
}
export function getReadableAqiId(value: number): string {
  if (value < 0 || value > 100) {
    return 'forecast.airQuality.default';
  }
  const aqiLevels = [
    {min: 0, max: 25, id: 'forecast.airQuality.good'},
    {min: 26, max: 50, id: 'forecast.airQuality.medium'},
    {min: 51, max: 75, id: 'forecast.airQuality.bad'},
    {min: 76, max: 100, id: 'forecast.airQuality.veryBad'},
  ];

  const level = aqiLevels.find(({min, max}) => value >= min && value <= max);
  return level ? level.id : 'forecast.airQuality.default';
}
export function getBackgroundForAqi(value: number): string {
  const defaultBackground = '#a2fb99';
  if (value < 0 || value > 5) {
    return defaultBackground;
  }
  const aqiLevels = [
    {min: 0, max: 1, background: '#a2fb99'},
    {min: 2, max: 2, background: '#a8cf62'},
    {min: 3, max: 3, background: '#f4e964'},
    {min: 4, max: 5, background: '#fa655c'},
  ];

  const level = aqiLevels.find(({min, max}) => value >= min && value <= max);
  return level ? level.background : defaultBackground;
}


export function getReadablePressureUnitsId(units: PressureUnits): string {
  switch (units) {
  case PressureUnits.Pascal:
    return 'forecast.pressure.units.pascal';
  case PressureUnits.MmHg:
    return 'forecast.pressure.units.mmHg';
  }
}

export function getReadableWindUnitsId(units: WindSpeedUnits): string {
  switch (units) {
  case WindSpeedUnits.Kmh:
    return 'forecast.wind.units.kmh';
  case WindSpeedUnits.Ms:
    return 'forecast.wind.units.ms';
  }
}

export function getReadableTemperatureUnitsId(units: TempUnits): string {
  const tempUnits = {
    [TempUnits.Celsius]: 'forecast.temperature.units.celsius',
    [TempUnits.Kelvin]: 'forecast.temperature.units.kelvin',
    [TempUnits.Fahrenheit]: 'forecast.temperature.units.fahrenheit',
  };
  return tempUnits[units];
}

export function getReadableWindDirectionId(angle: number): string {
  const directions: [number, number, string][] = [
    [337.5, 360, 'forecast.wind.direction.N'],
    [0, 22.5, 'forecast.wind.direction.N'],
    [22.5, 67.5, 'forecast.wind.direction.NE'],
    [67.5, 112.5, 'forecast.wind.direction.E'],
    [112.5, 157.5, 'forecast.wind.direction.SE'],
    [157.5, 202.5, 'forecast.wind.direction.S'],
    [202.5, 247.5, 'forecast.wind.direction.SW'],
    [247.5, 292.5, 'forecast.wind.direction.W'],
    [292.5, 337.5, 'forecast.wind.direction.NW'],
  ];

  const direction = directions.find(
    ([min, max]) => angle >= min && angle <= max,
  );
  return direction ? direction[2] : 'forecast.wind.direction.default';
}


export function convertWindSpeed(value: number, originalUnits: WindSpeedUnits, targetUnits: WindSpeedUnits){
  const conversionFactors: Record<WindSpeedUnits, Record<WindSpeedUnits, number>> = {
    [WindSpeedUnits.Kmh]: {
      [WindSpeedUnits.Ms]: 0.277778,
    } as Record<WindSpeedUnits, number>,
    [WindSpeedUnits.Ms]: {
      [WindSpeedUnits.Kmh]: 3.6,
    } as Record<WindSpeedUnits, number>,
  };
  if (originalUnits === targetUnits) {
    return value;
  }
  return value * conversionFactors[originalUnits][targetUnits];
}

export function convertTemperature(value: number, originalUnits: TempUnits, targetUnits: TempUnits){
  const conversionFactors: Record<TempUnits, Record<TempUnits, (value: number) => number>> = {
    [TempUnits.Celsius]: {
      [TempUnits.Fahrenheit]: (value) => value * 1.8 + 32,
      [TempUnits.Kelvin]: (value) => value + 273.15,
    } as Record<TempUnits, (value: number) => number>,
    [TempUnits.Fahrenheit]: {
      [TempUnits.Celsius]: (value) => (value - 32) / 1.8,
      [TempUnits.Kelvin]: (value) => (value + 459.67) * 5 / 9,
    } as Record<TempUnits, (value: number) => number>,
    [TempUnits.Kelvin]: {
      [TempUnits.Celsius]: (value) => value - 273.15,
      [TempUnits.Fahrenheit]: (value) => value * 9 / 5 - 459.67,
    } as Record<TempUnits, (value: number) => number>,
  };
  if (originalUnits === targetUnits) {
    return value;
  }
  return conversionFactors[originalUnits][targetUnits](value);
}
export function convertPressure(value: number, originalUnits: PressureUnits, targetUnits: PressureUnits){
  const conversionFactors: Record<PressureUnits, Record<PressureUnits, number>> = {
    [PressureUnits.Pascal]: {
      [PressureUnits.MmHg]: 0.00750062 * 100,
    } as Record<PressureUnits, number>,
    [PressureUnits.MmHg]: {
      [PressureUnits.Pascal]: 133.322 * 0.01,
    } as Record<PressureUnits, number>,
  };

  if (originalUnits === targetUnits) {
    return value;
  }
  return value * conversionFactors[originalUnits][targetUnits];
}
