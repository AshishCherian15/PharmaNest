import { AUTH_COOKIE } from '@/lib/auth';
import { apiSuccess } from '@/lib/api-response';
import { requestLogger } from '@/lib/api-logger';

/**
 * POST /api/auth/logout
 * Clears session cookie and terminates user session
 * 
 * Response: { ok: true }
 */
export async function POST() {
  const startTime = performance.now();

  const res = apiSuccess({ ok: true });
  res.cookies.set(AUTH_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  requestLogger.logResponse('POST', '/api/auth/logout', 200, startTime);
  return res;
}
