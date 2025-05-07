import {MoonPhases, PressureUnits, TempUnits, WindSpeedUnits} from '../../types/api/Forecast';

export function getReadableMoonPhaseId(phase: MoonPhases): string {
  switch (phase) {
  case MoonPhases.NewMoon:
    return 'forecast.moonPhase.newMoon';
  case MoonPhases.FirstHalf:
    return 'forecast.moonPhase.firstHalf';
  case MoonPhases.FullMoon:
    return 'forecast.moonPhase.fullMoon';
  case MoonPhases.LastHalf:
    return 'forecast.moonPhase.lastHalf';
  }
}

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
  return 'forecast.pressure.default';
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
