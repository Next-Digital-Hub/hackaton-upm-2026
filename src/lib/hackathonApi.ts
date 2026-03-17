// lib/hackathonApi.ts
// Singleton and caching strategies applied for Green Software Engineering

export interface WeatherData {
  altitud: string;
  fecha: string;
  horaHrMax: string | null;
  horaHrMin: string | null;
  hrMax: string;
  hrMedia: string;
  hrMin: string;
  indicativo: string;
  nombre: string;
  prec: string;
  provincia: string;
  tmax: string;
  tmed: string;
  tmin: string;
}

const API_BASE_URL = 'http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com';

/**
 * Llama a la API de Clima con caché integrada (Sostenibilidad).
 * Al usar Next.js fetch, por defecto memoiza (cache: 'force-cache') o ajustamos revalidate.
 * Esto evita hacer ping 500 veces si todos los usuarios entran al mismo tiempo.
 */
export async function getWeatherData(disaster: boolean = false, provincia?: string): Promise<WeatherData> {
  const token = process.env.HACKATHON_API_TOKEN;
  
  let url = `${API_BASE_URL}/weather?disaster=${disaster}`;
  if (provincia) {
    url += `&provincia=${encodeURIComponent(provincia)}`;
  }

  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    // Revalidación cada 10 minutos para ahorrar procesamiento y ancho de banda
    next: { revalidate: 60 } // Reduced to 1m so changes apply faster
  });

  if (!res.ok) {
    throw new Error('Error al obtener datos meteorológicos externos');
  }

  return res.json();
}

/**
 * Función central para mandar el Prompt Engine y recibir consejo.
 */
export async function getLLMResponse(systemPrompt: string, userPrompt: string): Promise<string> {
  const token = process.env.HACKATHON_API_TOKEN;

  const res = await fetch(`${API_BASE_URL}/prompt`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      system_prompt: systemPrompt,
      user_prompt: userPrompt
    }),
    cache: 'no-store' // Las respuestas del LLM son únicas por usuario
  });

  if (!res.ok) {
    throw new Error('Error al comunicarse con la IA del Hackathon');
  }

  const data = await res.json();
  return data.response;
}
