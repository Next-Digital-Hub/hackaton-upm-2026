import { NextResponse } from 'next/server'
import { getWeatherData } from '@/lib/hackathonApi'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const disaster = searchParams.get('disaster') === 'true'

    // Caché y wrapper para Sostenibilidad, fetching the ACTUAL province data
    const data = await getWeatherData(disaster, session.user.province)

    // Override the province and station name so the UI reflects the user's actual location
    data.provincia = session.user.province
    data.nombre = `Estación Meteorológica de ${session.user.province}`

    // Como la API del hackathon (mock) siempre devuelve los mismos datos base (Turís),
    // aplicamos un pequeño modificador determinista a la precipitación para que 
    // cada provincia tenga valores distintos, como pidió el usuario.
    const precValue = parseFloat(data.prec.replace(',', '.')) || 0
    const provinceHash = session.user.province.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0)
    // Variación entre -20% y +50% según la provincia
    const variance = ((provinceHash % 70) - 20) / 100
    let finalPrec = precValue + (precValue * variance)
    
    // Si no es desastre, forzamos cielos despejados para ciertas provincias si lo deseamos, 
    // pero para mantener coherencia simplemente variamos el valor.
    if (!disaster && finalPrec > 0.5) {
        // En modo normal, hacemos que varíe más hacia el sol para contraste, excepto Valencia
       finalPrec = session.user.province === 'Valencia' ? finalPrec : (provinceHash % 2)
    }

    data.prec = finalPrec.toFixed(1).replace('.', ',')

    // Log query to database asynchronously
    setTimeout(async () => {
      try {
        await prisma.weatherQuery.create({
          data: {
            userId: session.user.id,
            data: JSON.stringify(data)
          }
        })
      } catch (e) {
        console.error('Error logging weather query:', e)
      }
    }, 0)

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error obteniendo clima' }, { status: 500 })
  }
}
