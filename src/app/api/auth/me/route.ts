import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ user: null })
    }
    return NextResponse.json({ 
      user: { 
        id: session.user.id,
        username: session.user.username, 
        role: session.user.role, 
        province: session.user.province 
      } 
    })
  } catch {
    return NextResponse.json({ user: null })
  }
}
