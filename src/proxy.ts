import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from './lib/auth'

const protectedRoutes = ['/dashboard', '/backoffice']
const publicRoutes = ['/login', '/register', '/']

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = req.cookies.get('session')?.value
  
  let session = null
  if (cookie) {
    try {
      session = await decrypt(cookie)
    } catch (e) {
      // Invalid session
    }
  }

  // Si intentan entrar a ruta protegida sin sesion -> al login
  if (isProtectedRoute && !session?.user) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Si ya tiene sesion y va al login/register -> al dashboard correspondiente
  if (isPublicRoute && session?.user && path !== '/') {
    if (session.user.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/backoffice', req.nextUrl))
    }
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
