import {
  length,
  area,
  mass,
  volume,
  volumeFlowRate,
  temperature,
  time,
  frequency,
  speed,
  pace,
  pressure,
  digital,
  illuminance,
  partsPer,
  voltage,
  current,
  power,
  apparentPower,
  reactivePower,
  energy,
  reactiveEnergy,
  angle,
} from "units-converter";

const convertersMap = {
  Length: length,
  Area: area,
  Mass: mass,
  Volume: volume,
  "Volume Flow Rate": volumeFlowRate,
  Temperature: temperature,
  Time: time,
  Frequency: frequency,
  Speed: speed,
  Pace: pace,
  Pressure: pressure,
  Digital: digital,
  Illuminance: illuminance,
  "Parts-Per": partsPer,
  Voltage: voltage,
  Current: current,
  Power: power,
  "Apparent Power": apparentPower,
  "Reactive Power": reactivePower,
  Energy: energy,
  "Reactive Energy": reactiveEnergy,
  Angle: angle,
};

export const unitsConverter = (measurements) => {
  const convertedList = measurements.map((measurement) => ({
    ...measurement,
    ...unitConverter(measurement.unit, measurement.value),
  }));

  const unit = convertedList[convertedList.length - 1].unit;

  return convertedList.map((measurement) => ({
    ...measurement,
    active: measurement.unit === unit,
  }));
};

const unitConverter = (unit, value) => {
  const category = findCategoryByUnit(unit);

  if (!category) {
    throw new Error(`Category not found for unit: ${unit}`);
  }

  const converter = convertersMap[category];

  if (!converter) {
    throw new Error(`Converter not found for category: ${category}`);
  }

  return converter(value).from(unit).toBest();
};

function findCategoryByUnit(unit) {
  for (const [category, units] of Object.entries(unitsByCategory)) {
    if (units.includes(unit)) {
      return category;
    }
  }
  return null; // якщо не знайдено категорію
}

export const unitsByCategory = {
  Length: ["mm", "cm", "m", "in", "ft-us", "ft", "mi"],
  Area: ["mm2", "cm2", "m2", "ha", "km2", "in2", "ft2", "ac", "mi2"],
  Mass: ["mcg", "mg", "g", "kg", "oz", "lb", "mt", "t"],
  Volume: [
    "mm3",
    "cm3",
    "ml",
    "l",
    "kl",
    "m3",
    "km3",
    "tsp",
    "Tbs",
    "in3",
    "fl-oz",
    "cup",
    "pnt",
    "qt",
    "gal",
    "ft3",
    "yd3",
  ],
  "Volume Flow Rate": [
    "mm3/s",
    "cm3/s",
    "ml/s",
    "cl/s",
    "dl/s",
    "l/s",
    "l/min",
    "l/h",
    "kl/s",
    "kl/min",
    "kl/h",
    "m3/s",
    "m3/min",
    "m3/h",
    "km3/s",
    "tsp/s",
    "Tbs/s",
    "in3/s",
    "in3/min",
    "in3/h",
    "fl-oz/s",
    "fl-oz/min",
    "fl-oz/h",
    "cup/s",
    "pnt/s",
    "pnt/min",
    "pnt/h",
    "qt/s",
    "gal/s",
    "gal/min",
    "gal/h",
    "ft3/s",
    "ft3/min",
    "ft3/h",
    "yd3/s",
    "yd3/min",
    "yd3/h",
  ],
  Temperature: ["C", "F", "K", "R"],
  Time: ["ns", "mu", "ms", "s", "min", "h", "d", "week", "month", "year"],
  Frequency: ["Hz", "mHz", "kHz", "MHz", "GHz", "THz", "rpm", "deg/s", "rad/s"],
  Speed: ["m/s", "km/h", "m/h", "knot", "ft/s"],
  Pace: ["s/m", "min/km", "s/ft"],
  Pressure: ["Pa", "hPa", "kPa", "MPa", "bar", "torr", "psi", "ksi"],
  Digital: ["b", "Kb", "Mb", "Gb", "Tb", "B", "KB", "MB", "GB", "TB"],
  Illuminance: ["lx", "ft-cd"],
  "Parts-Per": ["ppm", "ppb", "ppt", "ppq"],
  Voltage: ["V", "mV", "kV"],
  Current: ["A", "mA", "kA"],
  Power: ["W", "mW", "kW", "MW", "GW"],
  "Apparent Power": ["VA", "mVA", "kVA", "MVA", "GVA"],
  "Reactive Power": ["VAR", "mVAR", "kVAR", "MVAR", "GVAR"],
  Energy: ["Wh", "mWh", "kWh", "MWh", "GWh", "J", "kJ"],
  "Reactive Energy": ["VARh", "mVARh", "kVARh", "MVARh", "GVARh"],
  Angle: ["deg", "rad", "grad", "arcmin", "arcsec"],
};

export const allUnits = Object.values(unitsByCategory).flat();

export function isValidUnit(unit) {
  return allUnits.includes(unit);
}

export function getUnitCategory(unit) {
  if (!unit) {
    return null;
  }

  const key = unit.charAt(0).toUpperCase() + unit.slice(1).toLowerCase();
  const units = unitsByCategory[key];

  if (units) {
    return { key, units };
  }

  return null;
}
