import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE, parseSessionToken } from '@/lib/auth';
import {
  getAllCustomerOrders,
  updateCustomerOrderStatus,
} from '@/lib/customer-orders';
import type { CustomerOrderStatus } from '@/lib/types';

function unauthorized() {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

function isValidStatus(status: string): status is CustomerOrderStatus {
  return ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status);
}

async function requireAdmin() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);
  if (!session || session.role !== 'admin') {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return unauthorized();
  }

  return NextResponse.json({ orders: getAllCustomerOrders() });
}

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return unauthorized();
  }

  try {
    const body = await req.json();
    const id = String(body?.id ?? '').trim();
    const status = String(body?.status ?? '').trim();

    if (!id || !isValidStatus(status)) {
      return NextResponse.json({ message: 'Invalid id or status' }, { status: 400 });
    }

    const updated = updateCustomerOrderStatus(id, status);
    if (!updated.ok) {
      return NextResponse.json({ message: updated.message }, { status: 400 });
    }

    return NextResponse.json({ order: updated.order });
  } catch {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }
}
