import { cookies } from 'next/headers';
import { AUTH_COOKIE, parseSessionToken } from '@/lib/auth';
import { apiSuccess, ApiErrors } from '@/lib/api-response';
import { requestLogger } from '@/lib/api-logger';

/**
 * GET /api/auth/me
 * Returns current authenticated user session
 * 
 * Response: { user: SessionUser } or error if not authenticated
 * Errors: 401
 */
export async function GET() {
  const startTime = performance.now();

  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);

  if (!session) {
    requestLogger.logResponse('GET', '/api/auth/me', 401, startTime);
    return ApiErrors.unauthorized();
  }

  requestLogger.logResponse('GET', '/api/auth/me', 200, startTime, { userId: session.id });
  return apiSuccess({ authenticated: true, user: session });
}
