import { cookies } from 'next/headers';
import { AUTH_COOKIE, parseSessionToken } from '@/lib/auth';
import { apiSuccess, ApiErrors } from '@/lib/api-response';
import { createPrescription, getPrescriptionsForCustomer } from '@/lib/prescriptions';

export async function GET() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);

  if (!session || session.role !== 'customer') {
    return ApiErrors.unauthorized();
  }

  const prescriptions = await getPrescriptionsForCustomer(session.id);
  return apiSuccess({ prescriptions });
}

export async function POST(req: Request) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);

  if (!session || session.role !== 'customer') {
    return ApiErrors.unauthorized();
  }

  const body = (await req.json()) as {
    doctorName?: string;
    date?: string;
    notes?: string;
    imageDataUrl?: string;
    medicines?: Array<{ name: string; dosage: string; quantity: number }>;
  };

  if (!body?.doctorName || !body?.date || !body?.medicines?.length) {
    return ApiErrors.badRequest('Doctor name, date and medicines are required.');
  }

  const created = await createPrescription({
    patientId: session.id,
    patientName: session.name,
    doctorName: body.doctorName,
    date: body.date,
    notes: body.notes,
    imageDataUrl: body.imageDataUrl,
    medicines: body.medicines,
  });

  return apiSuccess({ prescription: created });
}
