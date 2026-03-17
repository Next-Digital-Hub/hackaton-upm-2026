import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const userId = session.user.id

    // Accepted contacts (where I am either the sender or receiver)
    const acceptedRecords = await prisma.emergencyContact.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [
          { userId: userId },
          { contactId: userId }
        ]
      },
      include: {
        owner: { select: { id: true, username: true, province: true } },
        contact: { select: { id: true, username: true, province: true } }
      }
    })

    const contacts = acceptedRecords.map(record => {
      // Return the other person
      const isOwner = record.userId === userId
      return {
        id: record.id,
        contact: isOwner ? record.contact : record.owner
      }
    })

    // Pending sent (I sent the request, waiting for them)
    const pendingSent = await prisma.emergencyContact.findMany({
      where: { userId: userId, status: 'PENDING' },
      include: { contact: { select: { username: true, province: true } } }
    })

    // Pending received (They sent it to me, I need to accept)
    const pendingReceivedRecords = await prisma.emergencyContact.findMany({
      where: { contactId: userId, status: 'PENDING' },
      include: { owner: { select: { id: true, username: true, province: true } } }
    })
    
    const pendingReceived = pendingReceivedRecords.map(record => ({
      id: record.id,
      contact: record.owner
    }))

    return NextResponse.json({ success: true, contacts, pendingSent, pendingReceived })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { username } = await request.json()
    const safeUsername = username?.trim()

    if (!safeUsername || safeUsername === session.user.username) {
      return NextResponse.json({ error: 'Usuario no válido' }, { status: 400 })
    }

    const targetUser = await prisma.user.findFirst({
      where: { username: safeUsername }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'El usuario no existe' }, { status: 404 })
    }

    // Check if relationship exists in either direction
    const existing = await prisma.emergencyContact.findFirst({
      where: {
        OR: [
          { userId: session.user.id, contactId: targetUser.id },
          { userId: targetUser.id, contactId: session.user.id }
        ]
      }
    })

    if (existing) {
      if (existing.status === 'ACCEPTED') {
        return NextResponse.json({ error: 'El usuario ya es tu contacto' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Ya existe una solicitud pendiente con este usuario' }, { status: 400 })
    }

    const newContact = await prisma.emergencyContact.create({
      data: {
        userId: session.user.id,
        contactId: targetUser.id,
        status: 'PENDING'
      }
    })

    return NextResponse.json({ success: true, message: 'Solicitud enviada', contact: newContact })
  } catch (error: any) {
    console.error("POST Contacts Error:", error)
    return NextResponse.json({ error: error.message || 'Error al enviar la solicitud' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id, action } = await request.json() // action: 'ACCEPT' or 'REJECT'

    const record = await prisma.emergencyContact.findUnique({
      where: { id }
    })

    if (!record || record.contactId !== session.user.id) {
      return NextResponse.json({ error: 'No tienes permiso o no existe' }, { status: 403 })
    }

    if (action === 'ACCEPT') {
      await prisma.emergencyContact.update({
        where: { id },
        data: { status: 'ACCEPTED' }
      })
      return NextResponse.json({ success: true, message: 'Solicitud aceptada' })
    } else if (action === 'REJECT') {
      await prisma.emergencyContact.delete({
        where: { id }
      })
      return NextResponse.json({ success: true, message: 'Solicitud rechazada' })
    }

    return NextResponse.json({ error: 'Acción inválida' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Error procesando solicitud' }, { status: 500 })
  }
}
