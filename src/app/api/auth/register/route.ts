import {
  AUTH_COOKIE,
  authCookieOptions,
  createSessionToken,
} from '@/lib/auth';
import type { NextRequest } from 'next/server';
import { registerUserDb } from '@/lib/auth-db';
import { validatePassword } from '@/lib/validation';
import { apiSuccess, apiError } from '@/lib/api-response';
import {
  validateRequiredString,
  validateEmail,
  validatePhone,
} from '@/lib/api-validation';
import { requestLogger } from '@/lib/api-logger';
import { authLimiter } from '@/lib/rate-limit';
import { isDemoModeEnabled } from '@/lib/demo-mode';

/**
 * POST /api/auth/register
 * Creates a new customer account with registration details
 * Returns session token in secure HTTP-only cookie
 * 
 * Request body:
 *   - name: string (required, 2-100 chars)
 *   - email: string (required, valid email)
 *   - phone: string (required, valid phone)
 *   - password: string (required, strong policy enforced)
 * 
 * Response: { user: SessionUser }
 * Errors: 400, 409, 429 (rate limited)
 */
export async function POST(req: NextRequest) {
  const startTime = performance.now();

  // Check rate limit
  const limitResult = authLimiter(req);
  if (!limitResult.ok) {
    requestLogger.logResponse('POST', '/api/auth/register', 429, startTime);
    const res = apiError('Too many registration attempts. Please try again later.', 429, 'RATE_LIMITED');
    res.headers.set('Retry-After', String(limitResult.retryAfter || 900));
    return res;
  }

  try {
    const body = await req.json();
    const name = String(body?.name ?? '').trim();
    const email = String(body?.email ?? '').trim();
    const phone = String(body?.phone ?? '').trim();
    const password = String(body?.password ?? '');

    // Validate name
    const nameCheck = validateRequiredString(name, 'Name', 2, 100);
    if (!nameCheck.valid) {
      requestLogger.logResponse('POST', '/api/auth/register', 400, startTime);
      return apiError(nameCheck.error!, 400, 'INVALID_NAME');
    }

    // Validate email
    const emailCheck = validateEmail(email, 'Email');
    if (!emailCheck.valid) {
      requestLogger.logResponse('POST', '/api/auth/register', 400, startTime);
      return apiError(emailCheck.error!, 400, 'INVALID_EMAIL');
    }

    // Validate phone
    const phoneCheck = validatePhone(phone, 'Phone');
    if (!phoneCheck.valid) {
      requestLogger.logResponse('POST', '/api/auth/register', 400, startTime);
      return apiError(phoneCheck.error!, 400, 'INVALID_PHONE');
    }

    // Validate password strength
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      requestLogger.logResponse('POST', '/api/auth/register', 400, startTime);
      return apiError(
        passwordCheck.feedback[0] ?? 'Password does not meet requirements',
        400,
        'WEAK_PASSWORD',
        { feedback: passwordCheck.feedback }
      );
    }

    if (isDemoModeEnabled()) {
      const demoUser = {
        id: 'CUS-DEMO-NEW',
        name,
        email: email.toLowerCase(),
        role: 'customer' as const,
      };
      const token = createSessionToken(demoUser);
      const res = apiSuccess({ user: demoUser }, 201);
      res.cookies.set(AUTH_COOKIE, token, authCookieOptions);
      requestLogger.logResponse('POST', '/api/auth/register', 201, startTime, { userId: demoUser.id });
      return res;
    }

    // Attempt to register
    const result = await registerUserDb({
      name,
      email,
      phone,
      password,
      role: 'customer',
    });
    if (!result.ok) {
      requestLogger.logResponse('POST', '/api/auth/register', 409, startTime);
      return apiError(result.message, 409, 'EMAIL_EXISTS');
    }

    // Create session and set cookie
    const token = createSessionToken(result.user);
    const res = apiSuccess({ user: result.user }, 201);
    res.cookies.set(AUTH_COOKIE, token, authCookieOptions);

    requestLogger.logResponse('POST', '/api/auth/register', 201, startTime, {
      userId: result.user.id,
    });
    return res;
  } catch (error) {
    requestLogger.logError('POST', '/api/auth/register', error, startTime);
    return apiError('Invalid request payload', 400, 'PARSE_ERROR');
  }
}
