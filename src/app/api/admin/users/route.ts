import { apiSuccess, apiError } from '@/lib/api-response';
import { getUsers, createUser, searchUsers, emailExists } from '@/lib/users';
import { requestLogger } from '@/lib/api-logger';
import { validateRequiredString } from '@/lib/api-validation';

/**
 * GET /api/admin/users
 * List all users with optional filtering
 * Query params:
 *   - search: string (optional, search by name/email)
 *   - skip: number (optional, pagination offset)
 *   - take: number (optional, pagination limit)
 * 
 * Response: { users: User[] }
 */
export async function GET(req: Request) {
  const startTime = performance.now();
  
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const skip = parseInt(url.searchParams.get('skip') ?? '0', 10);
    const take = Math.min(parseInt(url.searchParams.get('take') ?? '50', 10), 100);

    let users;
    if (search) {
      users = await searchUsers(search);
    } else {
      users = await getUsers(skip, take);
    }

    requestLogger.logResponse('GET', '/api/admin/users', 200, startTime);
    return apiSuccess({ users }, 200);
  } catch (error) {
    requestLogger.logError('GET', '/api/admin/users', error, startTime);
    return apiError('Failed to fetch users', 500, 'FETCH_ERROR');
  }
}

/**
 * POST /api/admin/users
 * Create a new user
 * Request body:
 *   - name: string (required)
 *   - email: string (required, unique)
 *   - phone: string (required)
 *   - password: string (required, min 6 chars)
 *   - role: 'admin' | 'pharmacist' | 'customer' (required)
 * 
 * Response: { user: User }
 * Errors: 400, 409
 */
export async function POST(req: Request) {
  const startTime = performance.now();

  try {
    const body = await req.json();

    const nameCheck = validateRequiredString(body.name, 'Name', 1);
    if (!nameCheck.valid) {
      requestLogger.logResponse('POST', '/api/admin/users', 400, startTime);
      return apiError(nameCheck.error!, 400, 'INVALID_NAME');
    }

    const emailCheck = validateRequiredString(body.email, 'Email', 1);
    if (!emailCheck.valid) {
      requestLogger.logResponse('POST', '/api/admin/users', 400, startTime);
      return apiError(emailCheck.error!, 400, 'INVALID_EMAIL');
    }

    const phoneCheck = validateRequiredString(body.phone, 'Phone', 1);
    if (!phoneCheck.valid) {
      requestLogger.logResponse('POST', '/api/admin/users', 400, startTime);
      return apiError(phoneCheck.error!, 400, 'INVALID_PHONE');
    }

    const passwordCheck = validateRequiredString(body.password, 'Password', 6);
    if (!passwordCheck.valid) {
      requestLogger.logResponse('POST', '/api/admin/users', 400, startTime);
      return apiError(passwordCheck.error!, 400, 'INVALID_PASSWORD');
    }

    const validRoles = ['admin', 'pharmacist', 'customer'];
    if (!body.role || !validRoles.includes(body.role)) {
      requestLogger.logResponse('POST', '/api/admin/users', 400, startTime);
      return apiError('Role must be one of: admin, pharmacist, customer', 400, 'INVALID_ROLE');
    }

    // Check for duplicate email
    if (await emailExists(body.email.toLowerCase())) {
      requestLogger.logResponse('POST', '/api/admin/users', 409, startTime);
      return apiError('Email already in use', 409, 'DUPLICATE_EMAIL');
    }

    const user = await createUser({
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      phone: body.phone.trim(),
      password: body.password,
      role: body.role,
    });

    requestLogger.logResponse('POST', '/api/admin/users', 201, startTime);
    return apiSuccess({ user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    }}, 201);
  } catch (error) {
    requestLogger.logError('POST', '/api/admin/users', error, startTime);
    return apiError('Failed to create user', 500, 'CREATE_ERROR');
  }
}
