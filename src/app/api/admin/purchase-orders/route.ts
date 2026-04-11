import { apiSuccess, apiError } from '@/lib/api-response';
import { requestLogger } from '@/lib/api-logger';
import { validateRequiredString } from '@/lib/api-validation';
import { createPurchaseOrder, getPurchaseOrders } from '@/lib/purchase-orders';

/**
 * GET /api/admin/purchase-orders
 * Retrieves all purchase orders
 */
export async function GET() {
  const startTime = performance.now();

  try {
    const orders = await getPurchaseOrders();
    requestLogger.logResponse('GET', '/api/admin/purchase-orders', 200, startTime);
    return apiSuccess({ orders }, 200);
  } catch (error) {
    requestLogger.logError('GET', '/api/admin/purchase-orders', error, startTime);
    return apiError('Failed to fetch purchase orders', 500, 'FETCH_ERROR');
  }
}

/**
 * POST /api/admin/purchase-orders
 * Creates a new purchase order
 */
export async function POST(req: Request) {
  const startTime = performance.now();

  try {
    const body = await req.json();

    const supplierIdCheck = validateRequiredString(body.supplierId, 'Supplier ID', 1);
    if (!supplierIdCheck.valid) {
      requestLogger.logResponse('POST', '/api/admin/purchase-orders', 400, startTime);
      return apiError(supplierIdCheck.error!, 400, 'INVALID_SUPPLIER');
    }

    if (typeof body.total !== 'number' || body.total < 0) {
      requestLogger.logResponse('POST', '/api/admin/purchase-orders', 400, startTime);
      return apiError('Total must be a non-negative number', 400, 'INVALID_TOTAL');
    }

    const order = await createPurchaseOrder({
      supplierId: body.supplierId,
      total: body.total,
      expectedDeliveryDate: body.expectedDeliveryDate,
    });

    requestLogger.logResponse('POST', '/api/admin/purchase-orders', 201, startTime);
    return apiSuccess({ order }, 201);
  } catch (error: any) {
    if (error?.code === 'P2003') {
      requestLogger.logResponse('POST', '/api/admin/purchase-orders', 400, startTime);
      return apiError('Invalid supplier selected', 400, 'INVALID_SUPPLIER');
    }
    requestLogger.logError('POST', '/api/admin/purchase-orders', error, startTime);
    return apiError('Failed to create purchase order', 500, 'CREATE_ERROR');
  }
}
