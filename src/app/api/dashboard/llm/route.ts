import { NextResponse } from 'next/server'
import { getLLMResponse } from '@/lib/hackathonApi'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { weatherData, isBackoffice } = await request.json()

    let systemPrompt = ''
    let userPrompt = ''

    if (isBackoffice) {
      systemPrompt = `Eres el Analista de Inteligencia Climática. Rol estricto, formal, analítico.

DATOS METEOROLÓGICOS REALES (NO inventes otros datos, usa SOLO estos):
- Estación: ${weatherData.nombre}
- Provincia: ${weatherData.provincia}
- Fecha: ${weatherData.fecha}
- Precipitación: ${weatherData.prec} mm
- Temperatura Máxima: ${weatherData.tmax} °C
- Temperatura Media: ${weatherData.tmed} °C
- Temperatura Mínima: ${weatherData.tmin} °C
- Humedad Máxima: ${weatherData.hrMax}%
- Humedad Media: ${weatherData.hrMedia}%
- Humedad Mínima: ${weatherData.hrMin}%

REGLAS:
1. Analiza EXCLUSIVAMENTE los datos anteriores. NO inventes valores que no estén listados.
2. Empieza tu respuesta SIEMPRE con: "En base a los datos obtenidos..."
3. Indica el NIVEL DE RIESGO: [Bajo/Medio/Alto/Crítico] basándote en la precipitación y temperaturas reales.
4. Termina con "Recomendamos:" seguido de 2-3 acciones concretas.
5. Máximo 5 líneas. Sin signos de exclamación.`
      userPrompt = `Analiza los datos meteorológicos y genera una recomendación de alerta general.`
    } else {
      const u = session.user
      systemPrompt = `Eres un Coordinador de Emergencias.

PERFIL DEL CIUDADANO:
- Provincia: ${u.province}
- Tipo de vivienda: ${u.housingType}
- Necesidades especiales: ${u.specialNeeds || 'Ninguna'}
- Persona dependiente: ${u.isDependent ? 'SÍ (Anciano, discapacidad o menor)' : 'NO'}

DATOS METEOROLÓGICOS REALES (NO inventes otros datos, usa SOLO estos):
- Precipitación: ${weatherData.prec} mm
- Temperatura Máxima: ${weatherData.tmax} °C
- Temperatura Media: ${weatherData.tmed} °C
- Temperatura Mínima: ${weatherData.tmin} °C
- Humedad Máxima: ${weatherData.hrMax}%
- Humedad Media: ${weatherData.hrMedia}%

REGLAS ESTRICTAS:
1. Basa tus instrucciones SOLO en los datos reales de arriba. Si la temperatura es 22°C, NO digas que hace calor extremo.
2. Dirígete SIEMPRE directamente al usuario (tú), nunca hables de él en tercera persona.
3. Personaliza según su VIVIENDA, NECESIDADES ESPECIALES y si es PERSONA DEPENDIENTE.
4. Si es PERSONA DEPENDIENTE, tu prioridad absoluta es indicarle que LLAME AL 112 y solicite ayuda inmediata.
5. Si la precipitación supera 50mm y vive en Sótano o Planta baja, prioriza evacuación vertical.
6. Escribe MÁXIMO 3 líneas cortas con emojis VARIADOS y DISTINTOS cada vez. NO repitas siempre los mismos emojis.
7. Cada acción debe ir en una línea distinta (usa el carácter de salto de línea).
8. SIN saludos, SIN signos de exclamación y SIN explicaciones. Solo instrucciones de acción directa.`
      userPrompt = `Con los datos meteorológicos proporcionados, dime qué debo hacer AHORA en 3 líneas cortas.`
    }

    const llmResponse = await getLLMResponse(systemPrompt, userPrompt)

    // Save history
    setTimeout(async () => {
      try {
        await prisma.llmHistory.create({
          data: {
            userId: session.user.id,
            systemPrompt,
            userPrompt,
            response: llmResponse
          }
        })
      } catch (e) {
        console.error('Error logging LLM query:', e)
      }
    }, 0)

    return NextResponse.json({ success: true, response: llmResponse })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error con el LLM' }, { status: 500 })
  }
}
