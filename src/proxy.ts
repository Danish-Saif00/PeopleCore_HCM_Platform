import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canAccessRoute } from './lib/permissions';

const SESSION_COOKIE = 'pc_session';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let API requests, static files, and public routes bypass middleware
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/verify-email' ||
    pathname === '/invite'
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE);

  // If no session exists, redirect to login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    
    // Check if session has expired
    if (new Date(session.expiresAt) < new Date()) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }

    // Role-gated route authorization checks
    const hasAccess = canAccessRoute(session.role, pathname);
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/restricted', request.url));
    }
  } catch {
    // If JSON parsing fails, delete cookie and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
