import { t } from 'i18next';
import { MoonPhases, PressureUnits, WindSpeedUnits } from '../../types/api/Forecast';
import { Animated } from 'react-native';

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
  if (degree >= 0 && degree <= 4) {
    return 'forecast.geomagnetic.weak';
  } else if (degree >= 5 && degree <= 6) {
    return 'forecast.geomagnetic.medium';
  } else if (degree >= 7 && degree <= 9) {
    return 'forecast.geomagnetic.strong';
  }

  return 'forecast.geomagnetic.default';
}

export function getReadableHumidityId(value: number): string {
  if (value >= 0 && value < 40) {
    return 'forecast.humidity.low';
  } else if (value >= 40 && value <= 60) {
    return 'forecast.humidity.medium';
  } else if (value > 60 && value <= 100) {
    return 'forecast.humidity.high';
  }

  return 'forecast.humidity.default';
}

export function getReadablePressureId(value: number, units: PressureUnits): string {
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

export function getReadableWindDirectionId(angle: number): string {
  if ((angle > 337.5 && angle <= 360) || (angle >= 0 && angle < 22.5)) {
    return 'forecast.wind.direction.N';
  } else if (angle >= 22.5 && angle <= 67.5) {
    return 'forecast.wind.direction.NE';
  } else if (angle > 67.5 && angle < 112.5) {
    return 'forecast.wind.direction.E';
  } else if (angle >= 112.5 && angle <= 157.5) {
    return 'forecast.wind.direction.SE';
  } else if (angle > 157.5 && angle < 202.5) {
    return 'forecast.wind.direction.S';
  } else if (angle >= 202.5 && angle <= 247.5) {
    return 'forecast.wind.direction.SW';
  } else if (angle > 247.5 && angle < 292.5) {
    return 'forecast.wind.direction.W';
  } else if (angle >= 292.5 && angle <= 337.5) {
    return 'forecast.wind.direction.NW';
  }

  return 'forecast.wind.direction.default';
}
