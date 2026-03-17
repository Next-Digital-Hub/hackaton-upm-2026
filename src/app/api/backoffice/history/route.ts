import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado. Solo Backoffice.' }, { status: 403 })
    }

    const llmHistory = await prisma.llmHistory.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50,
      include: {
        user: { select: { username: true, role: true, province: true } }
      }
    })

    const weatherHistory = await prisma.weatherQuery.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50,
      include: {
        user: { select: { username: true, province: true } }
      }
    })

    const alerts = await prisma.alert.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({ success: true, llmHistory, weatherHistory, alerts })
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al obtener historial' }, { status: 500 })
  }
}
