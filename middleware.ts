import { NextResponse, type NextRequest } from 'next/server';

const AUTH_COOKIE = 'pharmanest_session';

type LightweightSession = {
  role: 'admin' | 'customer';
  exp: number;
};

function parseSessionFromToken(token?: string): LightweightSession | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const json = atob(padded);
    const data = JSON.parse(json) as LightweightSession;
    const now = Math.floor(Date.now() / 1000);

    if (!data.role || !data.exp || data.exp < now) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static files from /public and any extension-based asset paths.
  if (/\.[^/]+$/.test(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const session = parseSessionFromToken(token);

  const isSplashRoute = pathname === '/';
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isCustomerRoute = pathname.startsWith('/customer');
  const isPublicAuthRoute = pathname === '/login' || pathname === '/register';
  const isProtectedRoute = !isSplashRoute && !isPublicAuthRoute;

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isDashboardRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (session.role !== 'admin') {
      return NextResponse.redirect(new URL('/customer', req.url));
    }
  }

  if (isCustomerRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (session.role !== 'customer') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  if (isPublicAuthRoute && session) {
    const destination = session.role === 'admin' ? '/dashboard' : '/customer';
    return NextResponse.redirect(new URL(destination, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
