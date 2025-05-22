import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Get token from cookies
  const token = request.cookies.get('token')?.value
  const isAuthPage = request.nextUrl.pathname === '/login'

  // If trying to access auth page while logged in, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If trying to access protected route without token, redirect to login
  if (!isAuthPage && !token) {
    const loginUrl = new URL('/login', request.url)
    // Add the current path as a redirect parameter
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // For API routes, return 401 instead of redirecting
  if (request.nextUrl.pathname.startsWith('/api/') && !token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  return NextResponse.next()
}

// Configure which routes to protect
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
