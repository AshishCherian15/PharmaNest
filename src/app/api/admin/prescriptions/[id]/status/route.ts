import { cookies } from 'next/headers';
import { AUTH_COOKIE, parseSessionToken } from '@/lib/auth';
import { apiSuccess, ApiErrors } from '@/lib/api-response';
import { updatePrescriptionStatus } from '@/lib/prescriptions';

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);

  if (!session || session.role !== 'admin') {
    return ApiErrors.unauthorized();
  }

  const body = (await req.json()) as { status?: 'verified' | 'rejected' };
  if (!body?.status || !['verified', 'rejected'].includes(body.status)) {
    return ApiErrors.badRequest('Invalid status value.');
  }

  const { id } = await context.params;
  const updated = updatePrescriptionStatus(id, body.status);
  if (!updated) return ApiErrors.notFound('Prescription not found.');

  return apiSuccess({ prescription: updated });
}
