import { apiSuccess, apiError } from '@/lib/api-response';
import { getMedicines, createMedicine, searchMedicines } from '@/lib/medicines';
import { requestLogger } from '@/lib/api-logger';
import { validateRequiredString } from '@/lib/api-validation';

function getErrorCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : undefined;
  }

  return undefined;
}

/**
 * GET /api/admin/products
 * List all medicines with optional filtering
 * Query params:
 *   - category: string (optional, filter by category ID)
 *   - search: string (optional, search by name/generic name)
 *   - skip: number (optional, pagination offset)
 *   - take: number (optional, pagination limit)
 * 
 * Response: { medicines: Medicine[] }
 */
export async function GET(req: Request) {
  const startTime = performance.now();
  
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const category = url.searchParams.get('category');
    const skip = parseInt(url.searchParams.get('skip') ?? '0', 10);
    const take = Math.min(parseInt(url.searchParams.get('take') ?? '50', 10), 100);

    let medicines;
    if (search) {
      medicines = await searchMedicines(search);
    } else {
      medicines = await getMedicines(category ?? undefined, skip, take);
    }

    requestLogger.logResponse('GET', '/api/admin/products', 200, startTime);
    return apiSuccess({ medicines }, 200);
  } catch (error) {
    requestLogger.logError('GET', '/api/admin/products', error, startTime);
    return apiError('Failed to fetch medicines', 500, 'FETCH_ERROR');
  }
}

/**
 * POST /api/admin/products
 * Create a new medicine/product
 * Request body:
 *   - name: string (required, unique)
 *   - genericName: string (required)
 *   - categoryId: string (required)
 *   - price: number (required, in paise)
 *   - description?: string
 *   - dosage?: string
 *   - manufacturer?: string
 *   - quantity?: number
 *   - reorderLevel?: number
 *   - expiryDate?: string (ISO date)
 *   - batchNo?: string
 *   - image?: string (URL)
 * 
 * Response: { medicine: Medicine }
 * Errors: 400, 409
 */
export async function POST(req: Request) {
  const startTime = performance.now();

  try {
    const body = await req.json();

    const nameCheck = validateRequiredString(body.name, 'Medicine name', 1);
    if (!nameCheck.valid) {
      requestLogger.logResponse('POST', '/api/admin/products', 400, startTime);
      return apiError(nameCheck.error!, 400, 'INVALID_NAME');
    }

    const genericCheckCheck = validateRequiredString(body.genericName, 'Generic name', 1);
    if (!genericCheckCheck.valid) {
      requestLogger.logResponse('POST', '/api/admin/products', 400, startTime);
      return apiError(genericCheckCheck.error!, 400, 'INVALID_GENERIC_NAME');
    }

    const categoryCheckCheck = validateRequiredString(body.categoryId, 'Category ID', 1);
    if (!categoryCheckCheck.valid) {
      requestLogger.logResponse('POST', '/api/admin/products', 400, startTime);
      return apiError(categoryCheckCheck.error!, 400, 'INVALID_CATEGORY');
    }

    if (typeof body.price !== 'number' || body.price < 0) {
      requestLogger.logResponse('POST', '/api/admin/products', 400, startTime);
      return apiError('Price must be a non-negative number', 400, 'INVALID_PRICE');
    }

    const medicine = await createMedicine({
      name: body.name.trim(),
      genericName: body.genericName.trim(),
      categoryId: body.categoryId,
      price: body.price,
      description: body.description?.trim(),
      dosage: body.dosage?.trim(),
      manufacturer: body.manufacturer?.trim(),
      quantity: body.quantity ?? 0,
      reorderLevel: body.reorderLevel ?? 10,
      expiryDate: body.expiryDate,
      batchNo: body.batchNo?.trim(),
      image: body.image?.trim(),
    });

    requestLogger.logResponse('POST', '/api/admin/products', 201, startTime, {
      userId: medicine.id,
    });
    return apiSuccess({ medicine }, 201);
  } catch (error: unknown) {
    if (getErrorCode(error) === 'P2002') {
      // Unique constraint violation
      requestLogger.logResponse('POST', '/api/admin/products', 409, startTime);
      return apiError('Medicine name already exists', 409, 'DUPLICATE_NAME');
    }
    requestLogger.logError('POST', '/api/admin/products', error, startTime);
    return apiError('Failed to create medicine', 500, 'CREATE_ERROR');
  }
}
