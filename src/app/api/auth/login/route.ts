import {
  AUTH_COOKIE,
  AuthRole,
  authCookieOptions,
  createSessionToken,
} from '@/lib/auth';
import { validateCredentialsDb } from '@/lib/auth-db';
import { apiSuccess, apiError } from '@/lib/api-response';
import { validateEmail, validateRequiredString } from '@/lib/api-validation';
import { requestLogger } from '@/lib/api-logger';
import { authLimiter } from '@/lib/rate-limit';

/**
 * POST /api/auth/login
 * Authenticates user with email, password, and role
 * Returns session token in secure HTTP-only cookie
 * 
 * Request body:
 *   - email: string (required, must be valid email)
 *   - password: string (required, minimum 1 character)
 *   - role: 'admin' | 'customer' (required)
 * 
 * Response: { user: SessionUser }
 * Errors: 400, 401, 403, 429 (rate limited)
 */
export async function POST(req: Request) {
  const startTime = performance.now();
  
  // Check rate limit
  const nextReq = req as any; // Type assertion for rate limiter
  const limitResult = authLimiter(nextReq);
  if (!limitResult.ok) {
    requestLogger.logResponse('POST', '/api/auth/login', 429, startTime);
    const res = apiError('Too many login attempts. Please try again later.', 429, 'RATE_LIMITED');
    res.headers.set('Retry-After', String(limitResult.retryAfter || 900));
    return res;
  }
  
  try {
    const body = await req.json();
    const email = String(body?.email ?? '').trim();
    const password = String(body?.password ?? '');
    const role = String(body?.role ?? '').trim() as AuthRole;

    // Validate inputs
    const emailCheck = validateEmail(email, 'Email');
    if (!emailCheck.valid) {
      requestLogger.logResponse('POST', '/api/auth/login', 400, startTime);
      return apiError(emailCheck.error!, 400, 'INVALID_EMAIL');
    }

    const passwordCheck = validateRequiredString(password, 'Password', 1);
    if (!passwordCheck.valid) {
      requestLogger.logResponse('POST', '/api/auth/login', 400, startTime);
      return apiError(passwordCheck.error!, 400, 'INVALID_PASSWORD');
    }

    if (!role || !['admin', 'customer'].includes(role)) {
      requestLogger.logResponse('POST', '/api/auth/login', 400, startTime);
      return apiError('Role must be "admin" or "customer"', 400, 'INVALID_ROLE');
    }

    // Authenticate user
    const user = await validateCredentialsDb(email, password, role);
    if (!user) {
      requestLogger.logResponse('POST', '/api/auth/login', 401, startTime);
      return apiError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    if (user.role !== role) {
      requestLogger.logResponse('POST', '/api/auth/login', 403, startTime);
      return apiError(
        `Account exists but not registered as ${role}`,
        403,
        'ROLE_MISMATCH'
      );
    }

    // Create session and set cookie
    const token = createSessionToken(user);
    const res = apiSuccess({ user }, 200);
    res.cookies.set(AUTH_COOKIE, token, authCookieOptions);
    
    requestLogger.logResponse('POST', '/api/auth/login', 200, startTime, { userId: user.id });
    return res;
  } catch (error) {
    requestLogger.logError('POST', '/api/auth/login', error, startTime);
    return apiError('Invalid request payload', 400, 'PARSE_ERROR');
  }
}
