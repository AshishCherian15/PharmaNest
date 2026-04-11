import { cookies } from 'next/headers';
import { AUTH_COOKIE, parseSessionToken } from '@/lib/auth';
import {
  createCustomerOrderDb,
  getOrdersForCustomerDb,
} from '@/lib/customer-orders-db';
import type { CustomerOrderItem } from '@/lib/types';
import { landingProducts } from '@/lib/data';
import { getAvailableStock, getStockSnapshot, getStockVersion } from '@/lib/catalog-stock';
import { hasVerifiedPrescription } from '@/lib/prescriptions';
import { 
  apiSuccess, 
  apiError, 
  ApiErrors 
} from '@/lib/api-response';
import { 
  validateRequiredString, 
  validatePositiveNumber, 
  validateArray 
} from '@/lib/api-validation';
import { requestLogger } from '@/lib/api-logger';

/**
 * GET /api/customer/orders
 * Retrieves all orders for authenticated customer
 * 
 * Response: { orders: CustomerOrder[] }
 * Errors: 401
 */
export async function GET() {
  const startTime = performance.now();

  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);

  if (!session || session.role !== 'customer') {
    requestLogger.logResponse('GET', '/api/customer/orders', 401, startTime);
    return ApiErrors.unauthorized();
  }

  const orders = await getOrdersForCustomerDb(session.id);
  requestLogger.logResponse('GET', '/api/customer/orders', 200, startTime, {
    userId: session.id,
  });

  return apiSuccess({ orders });
}

/**
 * POST /api/customer/orders
 * Creates a new order for customer
 * Validates prescription requirements, stock availability, and pricing
 * 
 * Request body:
 *   - address: string (required, delivery address)
 *   - subtotal: number (required, cart subtotal in paise)
 *   - stockVersion: number (required, for optimistic concurrency)
 *   - items: CustomerOrderItem[] (required, at least 1 item)
 * 
 * Response: { order: CustomerOrder }
 * Errors: 400, 401, 403, 409
 */
export async function POST(req: Request) {
  const startTime = performance.now();

  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);

  if (!session || session.role !== 'customer') {
    requestLogger.logResponse('POST', '/api/customer/orders', 401, startTime);
    return ApiErrors.unauthorized();
  }

  try {
    const body = await req.json();
    const address = String(body?.address ?? '').trim();
    const subtotal = Number(body?.subtotal ?? 0);
    const clientStockVersion = Number(body?.stockVersion ?? 0);
    const items = Array.isArray(body?.items) ? (body.items as CustomerOrderItem[]) : [];

    // Validate address
    const addressCheck = validateRequiredString(address, 'Delivery address', 5);
    if (!addressCheck.valid) {
      requestLogger.logResponse('POST', '/api/customer/orders', 400, startTime, {
        userId: session.id,
      });
      return apiError(addressCheck.error!, 400, 'INVALID_ADDRESS');
    }

    // Validate subtotal
    const subtotalCheck = validatePositiveNumber(subtotal, 'Subtotal');
    if (!subtotalCheck.valid) {
      requestLogger.logResponse('POST', '/api/customer/orders', 400, startTime, {
        userId: session.id,
      });
      return apiError('Subtotal must be greater than zero', 400, 'INVALID_SUBTOTAL');
    }

    // Validate items array
    const itemsCheck = validateArray<CustomerOrderItem>(items, 'Items', 1);
    if (!itemsCheck.valid) {
      requestLogger.logResponse('POST', '/api/customer/orders', 400, startTime, {
        userId: session.id,
      });
      return apiError(itemsCheck.error!, 400, 'INVALID_ITEMS');
    }

    const itemIds = items
      .map((item) => String(item.medicineId ?? '').trim())
      .filter(Boolean);

    // Check stock version exists
    if (!Number.isFinite(clientStockVersion) || clientStockVersion <= 0) {
      const snapshot = getStockSnapshot(itemIds);
      requestLogger.logResponse('POST', '/api/customer/orders', 409, startTime, {
        userId: session.id,
      });
      return apiError(
        'Stock version required. Please refresh and try again.',
        409,
        'MISSING_STOCK_VERSION',
        {
          currentStockVersion: snapshot.version,
          stock: snapshot.stock,
        }
      );
    }

    // Check for stock conflicts
    const serverStockVersion = getStockVersion();
    if (clientStockVersion !== serverStockVersion) {
      const snapshot = getStockSnapshot(itemIds);
      requestLogger.logResponse('POST', '/api/customer/orders', 409, startTime, {
        userId: session.id,
      });
      return apiError(
        'Stock availability changed. Please review your cart and try again.',
        409,
        'STALE_STOCK_VERSION',
        {
          currentStockVersion: snapshot.version,
          stock: snapshot.stock,
        }
      );
    }

    // Normalize and validate items
    const rxRequiredNames: string[] = [];
    const normalizedItems = items
      .map((item) => {
        const medicineId = String(item.medicineId ?? '').trim();
        const quantity = Number(item.quantity ?? 0);
        const catalogProduct = landingProducts.find(
          (product) => product.id === medicineId
        );

        if (!catalogProduct) {
          return null;
        }

        const available = getAvailableStock(catalogProduct.id);
        if (!Number.isFinite(quantity) || quantity <= 0 || quantity > available) {
          return null;
        }

        if (catalogProduct.requiresPrescription) {
          rxRequiredNames.push(catalogProduct.name);
        }

        return {
          medicineId: catalogProduct.id,
          name: catalogProduct.name,
          genericName: catalogProduct.genericName,
          unitPrice: catalogProduct.price,
          quantity,
        } as CustomerOrderItem;
      })
      .filter((item): item is CustomerOrderItem => Boolean(item));

    if (!normalizedItems.length) {
      requestLogger.logResponse('POST', '/api/customer/orders', 400, startTime, {
        userId: session.id,
      });
      return apiError(
        'Order contains no valid items. Please check and retry.',
        400,
        'NO_VALID_ITEMS'
      );
    }

    // Check prescription requirement
    if (
      rxRequiredNames.length > 0 &&
      !hasVerifiedPrescription(session.id)
    ) {
      requestLogger.logResponse('POST', '/api/customer/orders', 403, startTime, {
        userId: session.id,
      });
      return apiError(
        `Verified prescription required for: ${rxRequiredNames.join(', ')}`,
        403,
        'REQUIRES_PRESCRIPTION',
        {
          items: rxRequiredNames,
        }
      );
    }

    // Verify pricing
    const calculatedSubtotal = normalizedItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    if (Math.abs(calculatedSubtotal - subtotal) > 1) {
      requestLogger.logResponse('POST', '/api/customer/orders', 400, startTime, {
        userId: session.id,
      });
      return apiError(
        'Price mismatch detected. Please refresh your cart.',
        400,
        'PRICE_MISMATCH',
        {
          expected: calculatedSubtotal,
          received: subtotal,
        }
      );
    }

    // Create order
    const created = await createCustomerOrderDb({
      user: session,
      address,
      items: normalizedItems,
      subtotal: calculatedSubtotal,
    });

    if (!created.ok) {
      const snapshot = getStockSnapshot(itemIds);
      requestLogger.logResponse('POST', '/api/customer/orders', 409, startTime, {
        userId: session.id,
      });
      return apiError(
        'Insufficient stock for one or more items.',
        409,
        'INSUFFICIENT_STOCK',
        {
          currentStockVersion: snapshot.version,
          stock: snapshot.stock,
        }
      );
    }

    requestLogger.logResponse('POST', '/api/customer/orders', 201, startTime, {
      userId: session.id,
    });
    return apiSuccess({ order: created.order }, 201);
  } catch (error) {
    requestLogger.logError('POST', '/api/customer/orders', error, startTime, {
      userId: session.id,
    });
    return apiError('Invalid request. Please check your input.', 400, 'PARSE_ERROR');
  }
}
