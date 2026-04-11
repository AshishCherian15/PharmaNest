import { cookies } from 'next/headers';
import { AUTH_COOKIE, parseSessionToken } from '@/lib/auth';
import { getPrescriptionEligibility } from '@/lib/prescriptions';
import { apiSuccess, ApiErrors } from '@/lib/api-response';
import { requestLogger } from '@/lib/api-logger';

/**
 * GET /api/customer/prescriptions/eligibility
 * Checks if customer has a verified prescription on file
 * Required before ordering Rx items
 * 
 * Response: { eligibility: { hasVerifiedPrescription: boolean } }
 * Errors: 401
 */
export async function GET() {
  const startTime = performance.now();

  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);

  if (!session || session.role !== 'customer') {
    requestLogger.logResponse('GET', '/api/customer/prescriptions/eligibility', 401, startTime);
    return ApiErrors.unauthorized();
  }

  const eligibility = getPrescriptionEligibility(session.id);
  requestLogger.logResponse('GET', '/api/customer/prescriptions/eligibility', 200, startTime, {
    userId: session.id,
  });

  return apiSuccess({ eligibility });
}
