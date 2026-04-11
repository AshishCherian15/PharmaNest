import { cookies } from 'next/headers';
import { AUTH_COOKIE, parseSessionToken } from '@/lib/auth';
import { apiSuccess, ApiErrors } from '@/lib/api-response';
import { getAllPrescriptions } from '@/lib/prescriptions';

export async function GET() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);

  if (!session || session.role !== 'admin') {
    return ApiErrors.unauthorized();
  }

  return apiSuccess({ prescriptions: await getAllPrescriptions() });
}
