import { apiSuccess, apiError } from '@/lib/api-response';
import {
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} from '@/lib/medicines';
import { requestLogger } from '@/lib/api-logger';

function getErrorCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : undefined;
  }

  return undefined;
}

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/admin/products/[id]
 * Get a single medicine by ID
 * 
 * Response: { medicine: Medicine }
 * Errors: 404
 */
export async function GET(req: Request, { params }: RouteParams) {
  const startTime = performance.now();
  const { id } = await params;

  try {
    const medicine = await getMedicineById(id);
    
    if (!medicine) {
      requestLogger.logResponse('GET', `/api/admin/products/${id}`, 404, startTime);
      return apiError('Medicine not found', 404, 'NOT_FOUND');
    }

    requestLogger.logResponse('GET', `/api/admin/products/${id}`, 200, startTime);
    return apiSuccess({ medicine }, 200);
  } catch (error) {
    requestLogger.logError('GET', `/api/admin/products/${id}`, error, startTime);
    return apiError('Failed to fetch medicine', 500, 'FETCH_ERROR');
  }
}

/**
 * PUT /api/admin/products/[id]
 * Update a medicine
 * Request body: Partial update fields (same as POST)
 * 
 * Response: { medicine: Medicine }
 * Errors: 400, 404, 409
 */
export async function PUT(req: Request, { params }: RouteParams) {
  const startTime = performance.now();
  const { id } = await params;

  try {
    const existing = await getMedicineById(id);
    if (!existing) {
      requestLogger.logResponse('PUT', `/api/admin/products/${id}`, 404, startTime);
      return apiError('Medicine not found', 404, 'NOT_FOUND');
    }

    const body = await req.json();

    // Validate optional fields
    if (body.price !== undefined && (typeof body.price !== 'number' || body.price < 0)) {
      requestLogger.logResponse('PUT', `/api/admin/products/${id}`, 400, startTime);
      return apiError('Price must be a non-negative number', 400, 'INVALID_PRICE');
    }

    const medicine = await updateMedicine(id, {
      name: body.name?.trim(),
      genericName: body.genericName?.trim(),
      categoryId: body.categoryId,
      price: body.price,
      description: body.description?.trim(),
      dosage: body.dosage?.trim(),
      manufacturer: body.manufacturer?.trim(),
      quantity: body.quantity,
      reorderLevel: body.reorderLevel,
      expiryDate: body.expiryDate,
      batchNo: body.batchNo?.trim(),
      image: body.image?.trim(),
    });

    if (!medicine) {
      requestLogger.logResponse('PUT', `/api/admin/products/${id}`, 404, startTime);
      return apiError('Medicine not found', 404, 'NOT_FOUND');
    }

    requestLogger.logResponse('PUT', `/api/admin/products/${id}`, 200, startTime);
    return apiSuccess({ medicine }, 200);
  } catch (error: unknown) {
    if (getErrorCode(error) === 'P2002') {
      requestLogger.logResponse('PUT', `/api/admin/products/${id}`, 409, startTime);
      return apiError('Medicine name already exists', 409, 'DUPLICATE_NAME');
    }
    requestLogger.logError('PUT', `/api/admin/products/${id}`, error, startTime);
    return apiError('Failed to update medicine', 500, 'UPDATE_ERROR');
  }
}

/**
 * DELETE /api/admin/products/[id]
 * Delete a medicine
 * 
 * Response: { success: boolean }
 * Errors: 404
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  const startTime = performance.now();
  const { id } = await params;

  try {
    const existing = await getMedicineById(id);
    if (!existing) {
      requestLogger.logResponse('DELETE', `/api/admin/products/${id}`, 404, startTime);
      return apiError('Medicine not found', 404, 'NOT_FOUND');
    }

    const deleted = await deleteMedicine(id);
    
    if (!deleted) {
      requestLogger.logResponse('DELETE', `/api/admin/products/${id}`, 500, startTime);
      return apiError('Failed to delete medicine', 500, 'DELETE_ERROR');
    }

    requestLogger.logResponse('DELETE', `/api/admin/products/${id}`, 200, startTime);
    return apiSuccess({ success: true }, 200);
  } catch (error) {
    requestLogger.logError('DELETE', `/api/admin/products/${id}`, error, startTime);
    return apiError('Failed to delete medicine', 500, 'DELETE_ERROR');
  }
}
