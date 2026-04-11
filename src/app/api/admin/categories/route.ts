import { apiSuccess, apiError } from '@/lib/api-response';
import { getCategories, createCategory } from '@/lib/suppliers';
import { requestLogger } from '@/lib/api-logger';
import { validateRequiredString } from '@/lib/api-validation';

/**
 * GET /api/admin/categories
 * List all medicine categories
 * 
 * Response: { categories: Category[] }
 */
export async function GET() {
  const startTime = performance.now();

  try {
    const categories = await getCategories();
    requestLogger.logResponse('GET', '/api/admin/categories', 200, startTime);
    return apiSuccess({ categories }, 200);
  } catch (error) {
    requestLogger.logError('GET', '/api/admin/categories', error, startTime);
    return apiError('Failed to fetch categories', 500, 'FETCH_ERROR');
  }
}

/**
 * POST /api/admin/categories
 * Create a new medicine category
 * Request body:
 *   - name: string (required, unique)
 *   - description?: string
 *   - image?: string (URL)
 * 
 * Response: { category: Category }
 */
export async function POST(req: Request) {
  const startTime = performance.now();

  try {
    const body = await req.json();
    const nameCheck = validateRequiredString(body.name, 'Category name', 1);
    
    if (!nameCheck.valid) {
      requestLogger.logResponse('POST', '/api/admin/categories', 400, startTime);
      return apiError(nameCheck.error!, 400, 'INVALID_NAME');
    }

    const category = await createCategory(
      body.name.trim(),
      body.description?.trim(),
      body.image?.trim()
    );

    requestLogger.logResponse('POST', '/api/admin/categories', 201, startTime);
    return apiSuccess({ category }, 201);
  } catch (error) {
    const err = error as { code?: string };
    if (err?.code === 'P2002') {
      requestLogger.logResponse('POST', '/api/admin/categories', 409, startTime);
      return apiError('Category name already exists', 409, 'DUPLICATE_NAME');
    }
    requestLogger.logError('POST', '/api/admin/categories', error, startTime);
    return apiError('Failed to create category', 500, 'CREATE_ERROR');
  }
}
