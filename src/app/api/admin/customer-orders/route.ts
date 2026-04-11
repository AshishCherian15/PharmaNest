import { cookies } from 'next/headers';
import { AUTH_COOKIE, parseSessionToken } from '@/lib/auth';
import {
  getAllCustomerOrdersDb,
  updateCustomerOrderStatusDb,
} from '@/lib/customer-orders-db';
import type { CustomerOrderStatus } from '@/lib/types';
import { apiSuccess, apiError, ApiErrors } from '@/lib/api-response';
import { validateRequiredString } from '@/lib/api-validation';
import { requestLogger } from '@/lib/api-logger';

/**
 * Valid order status values
 */
const VALID_STATUSES: CustomerOrderStatus[] = [
  'Placed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

function isValidStatus(status: string): status is CustomerOrderStatus {
  return VALID_STATUSES.includes(status as CustomerOrderStatus);
}

async function requireAdmin() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);
  if (!session || session.role !== 'admin') {
    return null;
  }
  return session;
}

/**
 * GET /api/admin/customer-orders
 * Retrieves all customer orders (admin only)
 * 
 * Response: { orders: CustomerOrder[] }
 * Errors: 401, 403
 */
export async function GET() {
  const startTime = performance.now();

  const session = await requireAdmin();
  if (!session) {
    requestLogger.logResponse('GET', '/api/admin/customer-orders', 401, startTime);
    return ApiErrors.unauthorized();
  }

  const orders = await getAllCustomerOrdersDb();
  requestLogger.logResponse('GET', '/api/admin/customer-orders', 200, startTime, {
    userId: session.id,
  });

  return apiSuccess({ orders });
}

/**
 * PATCH /api/admin/customer-orders
 * Updates order status (admin only)
 * 
 * Request body:
 *   - id: string (required, order ID)
 *   - status: CustomerOrderStatus (required, valid status)
 * 
 * Response: { order: CustomerOrder }
 * Errors: 400, 401, 403
 */
export async function PATCH(req: Request) {
  const startTime = performance.now();

  const session = await requireAdmin();
  if (!session) {
    requestLogger.logResponse('PATCH', '/api/admin/customer-orders', 401, startTime);
    return ApiErrors.unauthorized();
  }

  try {
    const body = await req.json();
    const id = String(body?.id ?? '').trim();
    const status = String(body?.status ?? '').trim();

    // Validate order ID
    const idCheck = validateRequiredString(id, 'Order ID');
    if (!idCheck.valid) {
      requestLogger.logResponse('PATCH', '/api/admin/customer-orders', 400, startTime, {
        userId: session.id,
      });
      return apiError(idCheck.error!, 400, 'INVALID_ORDER_ID');
    }

    // Validate status
    if (!isValidStatus(status)) {
      requestLogger.logResponse('PATCH', '/api/admin/customer-orders', 400, startTime, {
        userId: session.id,
      });
      return apiError(
        `Status must be one of: ${VALID_STATUSES.join(', ')}`,
        400,
        'INVALID_STATUS'
      );
    }

    // Update order
    const updated = await updateCustomerOrderStatusDb(id, status);
    if (!updated.ok) {
      requestLogger.logResponse('PATCH', '/api/admin/customer-orders', 400, startTime, {
        userId: session.id,
      });
      return apiError(updated.message, 400, 'UPDATE_FAILED');
    }

    requestLogger.logResponse('PATCH', '/api/admin/customer-orders', 200, startTime, {
      userId: session.id,
    });
    return apiSuccess({ order: updated.order });
  } catch (error) {
    requestLogger.logError(
      'PATCH',
      '/api/admin/customer-orders',
      error,
      startTime,
      { userId: session.id }
    );
    return apiError('Invalid request. Please check your input.', 400, 'PARSE_ERROR');
  }
}
