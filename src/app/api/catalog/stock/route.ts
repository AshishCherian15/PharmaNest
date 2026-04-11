import { getAllProducts } from '@/lib/product-store';
import { getStockSnapshot } from '@/lib/catalog-stock';
import { apiSuccess, apiError } from '@/lib/api-response';
import { requestLogger } from '@/lib/api-logger';

/**
 * GET /api/catalog/stock
 * Retrieves current stock levels for specified products
 * Enables real-time cart validation on client
 * 
 * Query params:
 *   - ids: comma-separated product IDs (optional, defaults to all)
 * 
 * Response: { stock: Record<string, number>, version: number }
 * Errors: 400
 */
export async function GET(req: Request) {
  const startTime = performance.now();

  try {
    const url = new URL(req.url);
    const idsParam = url.searchParams.get('ids');

    let ids: string[];

    if (idsParam) {
      ids = idsParam
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);

      if (!ids.length) {
        requestLogger.logResponse('GET', '/api/catalog/stock', 400, startTime);
        return apiError('No valid product IDs provided', 400, 'INVALID_IDS');
      }
    } else {
      ids = (await getAllProducts()).map((product) => product.id);
    }

    const { stock, version } = await getStockSnapshot(ids);

    requestLogger.logResponse('GET', '/api/catalog/stock', 200, startTime);
    return apiSuccess({ stock, version });
  } catch (error) {
    requestLogger.logError('GET', '/api/catalog/stock', error, startTime);
    return apiError('Failed to retrieve stock information', 500, 'STOCK_ERROR');
  }
}
