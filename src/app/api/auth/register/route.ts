import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { setSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { username, password, province, housingType, specialNeeds, isDependent } = data

    if (!username || !password || !province || !housingType) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'CITIZEN', // Role is ALWAYS citizen on registration. Admins are created via seed/backoffice only.
        province,
        housingType,
        specialNeeds: specialNeeds || null,
        isDependent: !!isDependent
      }
    })

    await setSession(user)

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username, role: user.role } })
  } catch (error) {
    console.error('Error in register:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
