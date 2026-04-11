import { apiSuccess, apiError } from '@/lib/api-response';
import {
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from '@/lib/suppliers';
import { requestLogger } from '@/lib/api-logger';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/admin/suppliers/[id]
 * Get a single supplier by ID
 * 
 * Response: { supplier: Supplier }
 * Errors: 404
 */
export async function GET(req: Request, { params }: RouteParams) {
  const startTime = performance.now();
  const { id } = await params;

  try {
    const supplier = await getSupplierById(id);
    
    if (!supplier) {
      requestLogger.logResponse('GET', `/api/admin/suppliers/${id}`, 404, startTime);
      return apiError('Supplier not found', 404, 'NOT_FOUND');
    }

    requestLogger.logResponse('GET', `/api/admin/suppliers/${id}`, 200, startTime);
    return apiSuccess({ supplier }, 200);
  } catch (error) {
    requestLogger.logError('GET', `/api/admin/suppliers/${id}`, error, startTime);
    return apiError('Failed to fetch supplier', 500, 'FETCH_ERROR');
  }
}

/**
 * PUT /api/admin/suppliers/[id]
 * Update a supplier
 * Request body: Partial update fields
 * 
 * Response: { supplier: Supplier }
 * Errors: 400, 404
 */
export async function PUT(req: Request, { params }: RouteParams) {
  const startTime = performance.now();
  const { id } = await params;

  try {
    const existing = await getSupplierById(id);
    if (!existing) {
      requestLogger.logResponse('PUT', `/api/admin/suppliers/${id}`, 404, startTime);
      return apiError('Supplier not found', 404, 'NOT_FOUND');
    }

    const body = await req.json();

    const supplier = await updateSupplier(id, {
      name: body.name?.trim(),
      contactPerson: body.contactPerson?.trim(),
      email: body.email?.trim(),
      phone: body.phone?.trim(),
      address: body.address?.trim(),
      city: body.city?.trim(),
      state: body.state?.trim(),
      pincode: body.pincode?.trim(),
      gstNo: body.gstNo?.trim(),
    });

    if (!supplier) {
      requestLogger.logResponse('PUT', `/api/admin/suppliers/${id}`, 404, startTime);
      return apiError('Supplier not found', 404, 'NOT_FOUND');
    }

    requestLogger.logResponse('PUT', `/api/admin/suppliers/${id}`, 200, startTime);
    return apiSuccess({ supplier }, 200);
  } catch (error: any) {
    requestLogger.logError('PUT', `/api/admin/suppliers/${id}`, error, startTime);
    return apiError('Failed to update supplier', 500, 'UPDATE_ERROR');
  }
}

/**
 * DELETE /api/admin/suppliers/[id]
 * Delete a supplier
 * 
 * Response: { success: boolean }
 * Errors: 404
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  const startTime = performance.now();
  const { id } = await params;

  try {
    const existing = await getSupplierById(id);
    if (!existing) {
      requestLogger.logResponse('DELETE', `/api/admin/suppliers/${id}`, 404, startTime);
      return apiError('Supplier not found', 404, 'NOT_FOUND');
    }

    const deleted = await deleteSupplier(id);
    
    if (!deleted) {
      requestLogger.logResponse('DELETE', `/api/admin/suppliers/${id}`, 500, startTime);
      return apiError('Failed to delete supplier', 500, 'DELETE_ERROR');
    }

    requestLogger.logResponse('DELETE', `/api/admin/suppliers/${id}`, 200, startTime);
    return apiSuccess({ success: true }, 200);
  } catch (error) {
    requestLogger.logError('DELETE', `/api/admin/suppliers/${id}`, error, startTime);
    return apiError('Failed to delete supplier', 500, 'DELETE_ERROR');
  }
}
