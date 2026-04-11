import { apiSuccess, apiError } from '@/lib/api-response';
import { requestLogger } from '@/lib/api-logger';
import { completeSale, getSalesTransactions } from '@/lib/sales';
import type { CartItem } from '@/lib/types';

/**
 * GET /api/admin/sales
 * Returns sales transaction history
 */
export async function GET() {
  const startTime = performance.now();

  try {
    const sales = getSalesTransactions();
    requestLogger.logResponse('GET', '/api/admin/sales', 200, startTime);
    return apiSuccess({ sales }, 200);
  } catch (error) {
    requestLogger.logError('GET', '/api/admin/sales', error, startTime);
    return apiError('Failed to fetch sales history', 500, 'FETCH_ERROR');
  }
}

/**
 * POST /api/admin/sales
 * Completes a POS sale and updates stock quantities
 */
export async function POST(req: Request) {
  const startTime = performance.now();

  try {
    const body = (await req.json()) as { items?: CartItem[] };
    const items = Array.isArray(body.items) ? body.items : [];

    if (items.length === 0) {
      requestLogger.logResponse('POST', '/api/admin/sales', 400, startTime);
      return apiError('Cart is empty', 400, 'EMPTY_CART');
    }

    const transaction = await completeSale(items);

    requestLogger.logResponse('POST', '/api/admin/sales', 201, startTime);
    return apiSuccess({ transaction }, 201);
  } catch (error: any) {
    requestLogger.logError('POST', '/api/admin/sales', error, startTime);
    return apiError(error?.message || 'Failed to complete sale', 400, 'SALE_ERROR');
  }
}
