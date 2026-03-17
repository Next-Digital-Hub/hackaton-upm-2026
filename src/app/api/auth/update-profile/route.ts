import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession, setSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const { province, housingType, specialNeeds, isDependent } = data

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        province,
        housingType,
        specialNeeds,
        isDependent: !!isDependent
      }
    })

    // Update session with new data
    await setSession(updatedUser)

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error: any) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Error al actualizar el perfil' }, { status: 500 })
  }
}
