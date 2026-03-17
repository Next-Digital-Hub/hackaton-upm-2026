import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { get7DayForecast } from '@/lib/forecast'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const forecast = await get7DayForecast(session.user.province)
    
    return NextResponse.json({ success: true, forecast })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error obteniendo previsión' }, { status: 500 })
  }
}
