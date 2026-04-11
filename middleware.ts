import { NextResponse, type NextRequest } from 'next/server';

const AUTH_COOKIE = 'pharmanest_session';

const AUTH_SECRET_FALLBACK = 'pharmanest-dev-secret-change-in-production';

type LightweightSession = {
  role: 'admin' | 'customer';
  exp: number;
};

function base64UrlToBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function getAuthSecret(): string | null {
  const secret = process.env.AUTH_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') return null;
  return AUTH_SECRET_FALLBACK;
}

async function verifySignature(header: string, body: string, signature: string): Promise<boolean> {
  const secret = getAuthSecret();
  if (!secret) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const payload = new TextEncoder().encode(`${header}.${body}`);
  const expected = base64UrlToBytes(signature);
  return crypto.subtle.verify('HMAC', key, expected, payload);
}

async function parseSessionFromToken(token?: string): Promise<LightweightSession | null> {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const [header, body, signature] = parts;
    const isValid = await verifySignature(header, body, signature);
    if (!isValid) return null;

    const payload = body.replace(/-/g, '+').replace(/_/g, '/');
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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static files from /public and any extension-based asset paths.
  if (/\.[^/]+$/.test(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const session = await parseSessionFromToken(token);

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
