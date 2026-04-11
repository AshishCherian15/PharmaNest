import { apiSuccess, apiError } from '@/lib/api-response';
import { getSuppliers, createSupplier, searchSuppliers } from '@/lib/suppliers';
import { requestLogger } from '@/lib/api-logger';
import { validateRequiredString, validateEmail, validatePhone } from '@/lib/api-validation';

/**
 * GET /api/admin/suppliers
 * List all suppliers
 * Query params:
 *   - search?: string
 *   - skip?: number
 *   - take?: number
 * 
 * Response: { suppliers: Supplier[] }
 */
export async function GET(req: Request) {
  const startTime = performance.now();

  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const skip = parseInt(url.searchParams.get('skip') ?? '0', 10);
    const take = Math.min(parseInt(url.searchParams.get('take') ?? '50', 10), 100);

    let suppliers;
    if (search) {
      suppliers = await searchSuppliers(search);
    } else {
      suppliers = await getSuppliers(skip, take);
    }

    requestLogger.logResponse('GET', '/api/admin/suppliers', 200, startTime);
    return apiSuccess({ suppliers }, 200);
  } catch (error) {
    requestLogger.logError('GET', '/api/admin/suppliers', error, startTime);
    return apiError('Failed to fetch suppliers', 500, 'FETCH_ERROR');
  }
}

/**
 * POST /api/admin/suppliers
 * Create a new supplier
 * Request body:
 *   - name: string (required, unique)
 *   - contactPerson: string (required)
 *   - email: string (required, unique, valid email)
 *   - phone: string (required, valid phone)
 *   - address?: string
 *   - city?: string
 *   - state?: string
 *   - pincode?: string
 *   - gstNo?: string
 * 
 * Response: { supplier: Supplier }
 */
export async function POST(req: Request) {
  const startTime = performance.now();

  try {
    const body = await req.json();

    // Validate required fields
    const nameCheck = validateRequiredString(body.name, 'Supplier name', 1);
    if (!nameCheck.valid) {
      requestLogger.logResponse('POST', '/api/admin/suppliers', 400, startTime);
      return apiError(nameCheck.error!, 400, 'INVALID_NAME');
    }

    const contactCheck = validateRequiredString(body.contactPerson, 'Contact person', 1);
    if (!contactCheck.valid) {
      requestLogger.logResponse('POST', '/api/admin/suppliers', 400, startTime);
      return apiError(contactCheck.error!, 400, 'INVALID_CONTACT');
    }

    const emailCheck = validateEmail(body.email, 'Email');
    if (!emailCheck.valid) {
      requestLogger.logResponse('POST', '/api/admin/suppliers', 400, startTime);
      return apiError(emailCheck.error!, 400, 'INVALID_EMAIL');
    }

    const phoneCheck = validatePhone(body.phone, 'Phone');
    if (!phoneCheck.valid) {
      requestLogger.logResponse('POST', '/api/admin/suppliers', 400, startTime);
      return apiError(phoneCheck.error!, 400, 'INVALID_PHONE');
    }

    const supplier = await createSupplier({
      name: body.name.trim(),
      contactPerson: body.contactPerson.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      address: body.address?.trim(),
      city: body.city?.trim(),
      state: body.state?.trim(),
      pincode: body.pincode?.trim(),
      gstNo: body.gstNo?.trim(),
    });

    requestLogger.logResponse('POST', '/api/admin/suppliers', 201, startTime);
    return apiSuccess({ supplier }, 201);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      const field = error?.meta?.target?.[0] === 'email' ? 'Email' : 'Name';
      requestLogger.logResponse('POST', '/api/admin/suppliers', 409, startTime);
      return apiError(`${field} already exists`, 409, 'DUPLICATE');
    }
    requestLogger.logError('POST', '/api/admin/suppliers', error, startTime);
    return apiError('Failed to create supplier', 500, 'CREATE_ERROR');
  }
}
