import { apiSuccess, apiError } from '@/lib/api-response';
import {
  getUserById,
  updateUser,
  deleteUser,
} from '@/lib/users';
import { requestLogger } from '@/lib/api-logger';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/admin/users/[id]
 * Get a single user by ID
 * 
 * Response: { user: User }
 * Errors: 404
 */
export async function GET(req: Request, { params }: RouteParams) {
  const startTime = performance.now();
  const { id } = await params;

  try {
    const user = await getUserById(id);
    
    if (!user) {
      requestLogger.logResponse('GET', `/api/admin/users/${id}`, 404, startTime);
      return apiError('User not found', 404, 'NOT_FOUND');
    }

    requestLogger.logResponse('GET', `/api/admin/users/${id}`, 200, startTime);
    return apiSuccess({ user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    }}, 200);
  } catch (error) {
    requestLogger.logError('GET', `/api/admin/users/${id}`, error, startTime);
    return apiError('Failed to fetch user', 500, 'FETCH_ERROR');
  }
}

/**
 * PUT /api/admin/users/[id]
 * Update a user
 * Request body: Partial update fields (name, phone, role, password)
 * 
 * Response: { user: User }
 * Errors: 400, 404
 */
export async function PUT(req: Request, { params }: RouteParams) {
  const startTime = performance.now();
  const { id } = await params;

  try {
    const existing = await getUserById(id);
    if (!existing) {
      requestLogger.logResponse('PUT', `/api/admin/users/${id}`, 404, startTime);
      return apiError('User not found', 404, 'NOT_FOUND');
    }

    const body = await req.json();

    const user = await updateUser(id, {
      name: body.name?.trim(),
      phone: body.phone?.trim(),
      role: body.role,
      password: body.password,
    });

    if (!user) {
      requestLogger.logResponse('PUT', `/api/admin/users/${id}`, 404, startTime);
      return apiError('User not found', 404, 'NOT_FOUND');
    }

    requestLogger.logResponse('PUT', `/api/admin/users/${id}`, 200, startTime);
    return apiSuccess({ user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    }}, 200);
  } catch (error: any) {
    requestLogger.logError('PUT', `/api/admin/users/${id}`, error, startTime);
    return apiError('Failed to update user', 500, 'UPDATE_ERROR');
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a user
 * 
 * Response: { success: boolean }
 * Errors: 404
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  const startTime = performance.now();
  const { id } = await params;

  try {
    const existing = await getUserById(id);
    if (!existing) {
      requestLogger.logResponse('DELETE', `/api/admin/users/${id}`, 404, startTime);
      return apiError('User not found', 404, 'NOT_FOUND');
    }

    const deleted = await deleteUser(id);
    
    if (!deleted) {
      requestLogger.logResponse('DELETE', `/api/admin/users/${id}`, 500, startTime);
      return apiError('Failed to delete user', 500, 'DELETE_ERROR');
    }

    requestLogger.logResponse('DELETE', `/api/admin/users/${id}`, 200, startTime);
    return apiSuccess({ success: true }, 200);
  } catch (error) {
    requestLogger.logError('DELETE', `/api/admin/users/${id}`, error, startTime);
    return apiError('Failed to delete user', 500, 'DELETE_ERROR');
  }
}
