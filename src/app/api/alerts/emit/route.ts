// Emit alert endpoint - Only admins can use this
// Alerts are scoped to the admin's province
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { alertBus } from '@/lib/alertBus'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado. Solo administradores.' }, { status: 403 })
    }

    const { title, message, level } = await request.json()

    if (!title || !message) {
      return NextResponse.json({ error: 'Título y mensaje son obligatorios' }, { status: 400 })
    }

    const province = session.user.province

    // Save alert to database
    const alert = await prisma.alert.create({
      data: {
        title,
        message,
        level: level || 'WARNING',
        province,
        emittedBy: session.user.username
      }
    })

    // Broadcast to all connected citizens via SSE (include province for filtering)
    alertBus.emit({
      type: 'alert',
      id: alert.id,
      title: alert.title,
      message: alert.message,
      level: alert.level,
      province: alert.province,
      emittedBy: alert.emittedBy,
      createdAt: alert.createdAt
    })

    // Notificar a los contactos de emergencia de los usuarios afectados
    try {
      const affectedUsers = await prisma.user.findMany({
        where: { province },
        select: { id: true }
      })
      const affectedUserIds = affectedUsers.map(u => u.id)

      if (affectedUserIds.length > 0) {
        const contactRelationships = await prisma.emergencyContact.findMany({
          where: {
            status: 'ACCEPTED',
            OR: [
              { userId: { in: affectedUserIds } },
              { contactId: { in: affectedUserIds } }
            ]
          },
          include: {
            owner: { select: { id: true, username: true, province: true } },
            contact: { select: { id: true, username: true, province: true } }
          }
        })

        const notifiedPairs = new Set<string>()

        for (const rel of contactRelationships) {
          const isOwnerAffected = affectedUserIds.includes(rel.userId)
          const isContactAffected = affectedUserIds.includes(rel.contactId)

          if (isOwnerAffected && !notifiedPairs.has(`${rel.userId}-${rel.contactId}`)) {
            alertBus.emit({
              type: 'contact_alert',
              targetUserId: rel.contactId,
              contactName: rel.owner.username,
              contactProvince: rel.owner.province,
              alertLevel: alert.level,
              alertTitle: alert.title
            })
            notifiedPairs.add(`${rel.userId}-${rel.contactId}`)
          }

          if (isContactAffected && !notifiedPairs.has(`${rel.contactId}-${rel.userId}`)) {
            alertBus.emit({
              type: 'contact_alert',
              targetUserId: rel.userId,
              contactName: rel.contact.username,
              contactProvince: rel.contact.province,
              alertLevel: alert.level,
              alertTitle: alert.title
            })
            notifiedPairs.add(`${rel.contactId}-${rel.userId}`)
          }
        }
      }
    } catch (error) {
      console.error('Error notificando contactos:', error)
    }

    const listeners = alertBus.getListenerCount()

    return NextResponse.json({ 
      success: true, 
      alert,
      broadcastedTo: listeners 
    })
  } catch (error: any) {
    console.error('Error emitting alert:', error)
    return NextResponse.json({ error: error.message || 'Error emitiendo alerta' }, { status: 500 })
  }
}
