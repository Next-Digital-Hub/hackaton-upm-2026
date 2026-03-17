import type { AemetWeatherRaw } from "@/lib/hackathon-api";

/**
 * Parsed weather data with proper numeric types.
 * Converted from AEMET's Spanish comma format.
 */
export interface WeatherParsed {
  // Station info
  station: string;
  stationCode: string;
  province: string;
  altitude: number | null;
  date: string;

  // Temperature (°C)
  tempAvg: number | null;
  tempMax: number | null;
  tempMin: number | null;
  tempMaxTime: string | null;
  tempMinTime: string | null;

  // Humidity (%)
  humidityAvg: number | null;
  humidityMax: number | null;
  humidityMin: number | null;
  humidityMaxTime: string | null;
  humidityMinTime: string | null;

  // Precipitation (mm)
  precipitation: number | null;

  // Wind
  windAvgSpeed: number | null;
  windGust: number | null;
  windDirection: string | null;
  windGustTime: string | null;

  // Pressure (hPa)
  pressureMax: number | null;
  pressureMin: number | null;

  // Sun (hours)
  sunHours: number | null;
}

/**
 * Parse a Spanish-format number string ("14,5" → 14.5).
 * Returns null for null/empty/invalid values.
 */
function parseSpanishNumber(value: string | null): number | null {
  if (value === null || value === undefined || value.trim() === "") {
    return null;
  }
  const normalized = value.replace(",", ".");
  const num = parseFloat(normalized);
  return isNaN(num) ? null : num;
}

/**
 * Parse raw AEMET weather data into typed WeatherParsed object.
 */
export function parseWeatherData(raw: AemetWeatherRaw): WeatherParsed {
  return {
    station: raw.nombre,
    stationCode: raw.indicativo,
    province: raw.provincia,
    altitude: parseSpanishNumber(raw.altitud),
    date: raw.fecha,

    tempAvg: parseSpanishNumber(raw.tmed),
    tempMax: parseSpanishNumber(raw.tmax),
    tempMin: parseSpanishNumber(raw.tmin),
    tempMaxTime: raw.horatmax,
    tempMinTime: raw.horatmin,

    humidityAvg: parseSpanishNumber(raw.hrMedia),
    humidityMax: parseSpanishNumber(raw.hrMax),
    humidityMin: parseSpanishNumber(raw.hrMin),
    humidityMaxTime: raw.horaHrMax,
    humidityMinTime: raw.horaHrMin,

    precipitation: parseSpanishNumber(raw.prec),

    windAvgSpeed: parseSpanishNumber(raw.velmedia),
    windGust: parseSpanishNumber(raw.racha),
    windDirection: raw.dir,
    windGustTime: raw.horaracha,

    pressureMax: parseSpanishNumber(raw.presMax),
    pressureMin: parseSpanishNumber(raw.presMin),

    sunHours: parseSpanishNumber(raw.sol),
  };
}

/**
 * Determine if weather conditions indicate disaster risk.
 * Based on AEMET thresholds for extreme weather in Mediterranean Spain.
 */
export function isDisasterRisk(weather: WeatherParsed): boolean {
  // Extreme precipitation (>100mm is already a red alert in AEMET)
  if (weather.precipitation !== null && weather.precipitation > 100) {
    return true;
  }
  // Extreme wind gusts (>120 km/h)
  if (weather.windGust !== null && weather.windGust > 120) {
    return true;
  }
  return false;
}

/**
 * Get a human-readable summary of precipitation level.
 */
export function getPrecipitationLevel(mm: number | null): {
  label: string;
  severity: "none" | "light" | "moderate" | "heavy" | "extreme";
} {
  if (mm === null || mm === 0) {
    return { label: "Sin precipitación", severity: "none" };
  }
  if (mm < 5) {
    return { label: "Lluvia débil", severity: "light" };
  }
  if (mm < 20) {
    return { label: "Lluvia moderada", severity: "moderate" };
  }
  if (mm < 60) {
    return { label: "Lluvia fuerte", severity: "heavy" };
  }
  return { label: "Lluvia torrencial", severity: "extreme" };
}

/**
 * Format a number for display with Spanish locale.
 */
export function formatWeatherValue(
  value: number | null,
  unit: string,
  decimals: number = 1
): string {
  if (value === null) return "N/D";
  return `${value.toFixed(decimals)}${unit}`;
}
