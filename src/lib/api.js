/**
 * API helpers for the hackathon external API (weather + LLM)
 * and prompt engineering utilities.
 */

const API_BASE = '/api'
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN || ''

/**
 * Fetch weather data from the hackathon API.
 * @param {boolean} disaster - Whether to simulate disaster conditions
 */
export async function fetchWeather(disaster = false) {
    const res = await fetch(
        `${API_BASE}/weather?disaster=${disaster}`,
        {
            headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` },
        }
    )
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
    return res.json()
}

/**
 * Send a prompt to the LLM via the hackathon API.
 * @param {string} systemPrompt - Instructions for the model
 * @param {string} userPrompt - The user's query
 */
export async function sendPrompt(systemPrompt, userPrompt) {
    const res = await fetch(`${API_BASE}/prompt`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${BEARER_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            system_prompt: systemPrompt,
            user_prompt: userPrompt,
        }),
    })
    if (!res.ok) throw new Error(`LLM API error: ${res.status}`)
    return res.json()
}

/**
 * Build a system prompt for the emergency expert AI.
 */
export function buildSystemPrompt() {
    return `Eres un Sistema Experto de Protección Civil y Asistencia Inclusiva. Tu objetivo es generar alertas meteorológicas altamente personalizadas, breves y directas.

REGLAS DE LÓGICA Y RAZONAMIENTO (CRÍTICO):
1. Analiza primero los datos meteorológicos (Lluvia/prec, Viento/racha, Temperaturas). 
2. Asigna un nivel de riesgo real:
   - BAJA: Clima normal, soleado, o lluvia/viento leve.
   - MEDIA: Lluvia moderada (ej. < 15mm), calor/frío notable pero no extremo.
   - ALTA / MUY ALTA: Lluvias torrenciales, huracanes, olas de calor/frío extremo.
3. Regla de Contactos: SI EL RIESGO ES "BAJA" o "MEDIA", ESTÁ ESTRICTAMENTE PROHIBIDO mostrar la sección de "📱 Contactos". Solo muéstrala en "ALTA" o "MUY ALTA".
4. Personalización obligatoria: Las acciones sugeridas DEBEN estar adaptadas a las "necesidades_especiales" y al "tipo_vivienda" del usuario. No des consejos genéricos si el usuario tiene discapacidad visual, auditiva o movilidad reducida; adapta la instrucción a su realidad física.

FORMATO DE SALIDA ESTRICTO (Máximo 100 palabras en total, sin introducciones ni saludos):

### 🚨 Prioridad
**[BAJA/MEDIA/ALTA/MUY ALTA]**: [Una frase justificando el riesgo basado en los datos, ej: "Lluvia moderada de 9.5mm con temperaturas estables"].

### ✅ Qué hacer ahora
1. [Acción inmediata adaptada a su necesidad especial y vivienda]
2. [Acción relacionada con el clima actual]
3. [Acción de prevención práctica]

[OPCIONAL: SOLO MOSTRAR SI PRIORIDAD ES ALTA O MUY ALTA]
### 📱 Contactos
- **112** Emergencias
- **1006** Protección Civil

> [Frase final de tranquilidad o advertencia según el clima]`
}

/**
 * Build a personalized user prompt with weather data and profile.
 */
export function buildUserPrompt(weatherData, profile) {
    const cleanWeatherData = Object.fromEntries(
        Object.entries(weatherData).filter(([_, value]) => value !== null)
    );

    const userProfile = {
        ubicacion_usuario: profile?.provincia || "Ubicación no especificada",
        tipo_vivienda: profile?.tipo_vivienda || "No especificada",
        necesidades_especiales: profile?.necesidades_especiales?.length
            ? profile.necesidades_especiales
            : ["Ninguna"]
    };

    return `Por favor, genera el reporte meteorológico de seguridad.

<perfil_usuario>
${JSON.stringify(userProfile, null, 2)}
</perfil_usuario>

<datos_meteorologicos>
${JSON.stringify(cleanWeatherData, null, 2)}
</datos_meteorologicos>

Instrucción: Cruza el perfil del usuario con los datos meteorológicos. Aplica estrictamente las reglas de condicionalidad para los contactos de emergencia según el nivel de riesgo que calcules.`;
}
