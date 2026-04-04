import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE, parseSessionToken } from '@/lib/auth';
import { getPrescriptionEligibility } from '@/lib/prescriptions';

function unauthorized() {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function GET() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);

  if (!session || session.role !== 'customer') {
    return unauthorized();
  }

  return NextResponse.json({
    eligibility: getPrescriptionEligibility(session.id),
  });
}
