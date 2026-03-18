import type { WeatherParsed } from "@/lib/weather";
import { getPrecipitationLevel } from "@/lib/weather";
import { HOUSING_TYPES, SPECIAL_NEEDS } from "@/config/constants";

interface UserProfile {
  province: string;
  housingType: string;
  specialNeeds: string[];
  name?: string | null;
}

/**
 * Build the system prompt for citizen safety recommendations.
 * The LLM acts as an expert in meteorology and civil protection.
 */
export function buildCitizenSystemPrompt(): string {
  return `Eres un experto en meteorología y protección civil en España. Tu misión es proporcionar recomendaciones de seguridad personalizadas a ciudadanos basándote en las condiciones meteorológicas actuales y su perfil personal.

INSTRUCCIONES:
- Analiza los datos meteorológicos proporcionados (temperatura, precipitación, humedad, viento).
- Ten en cuenta el tipo de vivienda del usuario para adaptar las recomendaciones:
  * Sótano: Riesgo de inundación, acumulación de agua, problemas de ventilación.
  * Planta baja: Riesgo de inundación directa, acceso rápido al exterior.
  * Piso alto: Riesgo de vientos fuertes, difícil evacuación.
  * Casa de campo: Aislamiento, riesgo de riadas, accesos cortados.
- Ten en cuenta las necesidades especiales:
  * Silla de ruedas: Movilidad reducida, necesita rutas accesibles, más tiempo de evacuación.
  * Persona dependiente: Requiere asistencia para evacuación, medicación, cuidados.
  * Mascotas: Necesita plan para transportar animales, refugios que admitan mascotas.
- Sé conciso pero completo. Usa viñetas.
- Prioriza las recomendaciones más urgentes primero.
- Si hay riesgo de desastre (precipitación >60mm), sé especialmente enfático en las medidas de seguridad.
- Responde SIEMPRE en español.
- NO uses formato markdown con # o ##. Usa viñetas simples (•) y texto plano.`;
}

/**
 * Build the user prompt with current weather data and user profile.
 */
export function buildCitizenUserPrompt(
  weather: WeatherParsed,
  profile: UserProfile
): string {
  const housingLabel =
    HOUSING_TYPES[profile.housingType as keyof typeof HOUSING_TYPES] ||
    profile.housingType;

  const needsLabels = profile.specialNeeds
    .map(
      (need) =>
        SPECIAL_NEEDS[need as keyof typeof SPECIAL_NEEDS] || need
    )
    .join(", ");

  const precipLevel = getPrecipitationLevel(weather.precipitation);

  const parts: string[] = [
    `DATOS METEOROLÓGICOS ACTUALES (${weather.date}):`,
    `• Estación: ${weather.station} (${weather.province})`,
    `• Temperatura: media ${weather.tempAvg ?? "N/D"}°C, máx ${weather.tempMax ?? "N/D"}°C, mín ${weather.tempMin ?? "N/D"}°C`,
    `• Precipitación: ${weather.precipitation ?? 0} mm (${precipLevel.label})`,
    `• Humedad: media ${weather.humidityAvg ?? "N/D"}%, máx ${weather.humidityMax ?? "N/D"}%, mín ${weather.humidityMin ?? "N/D"}%`,
  ];

  if (weather.windAvgSpeed !== null) {
    parts.push(
      `• Viento: velocidad media ${weather.windAvgSpeed} km/h${weather.windGust ? `, rachas de ${weather.windGust} km/h` : ""}${weather.windDirection ? `, dirección ${weather.windDirection}` : ""}`
    );
  } else {
    parts.push("• Viento: sin datos disponibles");
  }

  if (weather.pressureMax !== null || weather.pressureMin !== null) {
    parts.push(
      `• Presión: máx ${weather.pressureMax ?? "N/D"} hPa, mín ${weather.pressureMin ?? "N/D"} hPa`
    );
  }

  parts.push("");
  parts.push("PERFIL DEL USUARIO:");
  parts.push(`• Provincia: ${profile.province}`);
  parts.push(`• Tipo de vivienda: ${housingLabel}`);
  parts.push(
    `• Necesidades especiales: ${needsLabels || "Ninguna"}`
  );

  parts.push("");
  parts.push(
    "Por favor, proporciona recomendaciones de seguridad personalizadas basándote en estos datos meteorológicos y el perfil del usuario."
  );

  if (precipLevel.severity === "extreme" || precipLevel.severity === "heavy") {
    parts.push(
      "⚠️ ATENCIÓN: Las condiciones de precipitación son severas. Prioriza medidas de emergencia."
    );
  }

  return parts.join("\n");
}

/**
 * Build the system prompt for admin alert recommendation.
 * The LLM evaluates whether an alert should be issued.
 */
export function buildAdminSystemPrompt(): string {
  return `Eres un experto en meteorología y gestión de emergencias en España. Tu misión es evaluar datos meteorológicos y recomendar si se debe emitir una alerta a la población.

INSTRUCCIONES:
- Analiza los datos meteorológicos proporcionados.
- Evalúa el nivel de riesgo según los umbrales de AEMET:
  * Precipitación: >20mm moderada, >60mm fuerte, >100mm torrencial (alerta roja).
  * Viento: >50km/h precaución, >80km/h peligroso, >120km/h muy peligroso.
  * Temperatura: >40°C o <-5°C extremas.
- Indica claramente: RECOMENDAR ALERTA o NO RECOMENDAR ALERTA.
- Si recomiendas alerta, sugiere el nivel de severidad (BAJA, MODERADA, GRAVE, EXTREMA).
- Proporciona un breve texto sugerido para la alerta.
- Responde SIEMPRE en español.
- NO uses formato markdown con # o ##. Usa viñetas simples (•) y texto plano.`;
}

/**
 * Build the user prompt for admin alert evaluation.
 */
export function buildAdminUserPrompt(
  normalWeather: WeatherParsed,
  disasterWeather: WeatherParsed
): string {
  const parts: string[] = [
    `DATOS METEOROLÓGICOS NORMALES (${normalWeather.date}):`,
    `• Estación: ${normalWeather.station} (${normalWeather.province})`,
    `• Temperatura: media ${normalWeather.tempAvg ?? "N/D"}°C`,
    `• Precipitación: ${normalWeather.precipitation ?? 0} mm`,
    `• Humedad media: ${normalWeather.humidityAvg ?? "N/D"}%`,
    "",
    `DATOS METEOROLÓGICOS ESCENARIO DESASTRE:`,
    `• Temperatura: media ${disasterWeather.tempAvg ?? "N/D"}°C`,
    `• Precipitación: ${disasterWeather.precipitation ?? 0} mm`,
    `• Humedad media: ${disasterWeather.humidityAvg ?? "N/D"}%`,
    "",
    "Evalúa estos datos y recomienda si se debe emitir una alerta meteorológica a la población. Compara el escenario normal con el de desastre para determinar la gravedad.",
  ];

  return parts.join("\n");
}
