// Admin registration endpoint - Only existing admins can create new admins
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado. Solo administradores.' }, { status: 403 })
    }

    const { username, password, province } = await request.json()

    if (!username || !password || !province) {
      return NextResponse.json({ error: 'Usuario, contraseña y provincia son obligatorios' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { username } })
    if (existing) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'ADMIN',
        province,
        housingType: 'N/A',
        specialNeeds: null,
        campusRole: 'Administrador'
      }
    })

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, username: user.username, role: user.role, province: user.province }
    })
  } catch (error: any) {
    console.error('Error creating admin:', error)
    return NextResponse.json({ error: error.message || 'Error creando administrador' }, { status: 500 })
  }
}
