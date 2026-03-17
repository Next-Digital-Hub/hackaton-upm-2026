import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { setSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { username, password } = data

    if (!username || !password) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
    }

    await setSession(user)

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username, role: user.role } })
  } catch (error) {
    console.error('Error in login:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
