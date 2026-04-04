import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE, parseSessionToken } from '@/lib/auth';
import { createCustomerOrder, getOrdersForCustomer } from '@/lib/customer-orders';
import type { CustomerOrderItem } from '@/lib/types';
import { landingProducts } from '@/lib/data';
import { getAvailableStock, getStockSnapshot, getStockVersion } from '@/lib/catalog-stock';
import { hasVerifiedPrescription } from '@/lib/prescriptions';

function unauthorized() {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export async function GET() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);

  if (!session || session.role !== 'customer') {
    return unauthorized();
  }

  return NextResponse.json({ orders: getOrdersForCustomer(session.id) });
}

export async function POST(req: Request) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);

  if (!session || session.role !== 'customer') {
    return unauthorized();
  }

  try {
    const body = await req.json();
    const address = String(body?.address ?? '').trim();
    const subtotal = Number(body?.subtotal ?? 0);
    const clientStockVersion = Number(body?.stockVersion ?? 0);
    const items = Array.isArray(body?.items) ? (body.items as CustomerOrderItem[]) : [];

    if (!address) {
      return NextResponse.json({ message: 'Address is required' }, { status: 400 });
    }

    if (!Number.isFinite(subtotal) || subtotal <= 0) {
      return NextResponse.json({ message: 'Subtotal must be greater than zero' }, { status: 400 });
    }

    if (!items.length) {
      return NextResponse.json({ message: 'At least one item is required' }, { status: 400 });
    }

    const itemIds = items
      .map((item) => String(item.medicineId ?? '').trim())
      .filter(Boolean);

    if (!Number.isFinite(clientStockVersion) || clientStockVersion <= 0) {
      const snapshot = getStockSnapshot(itemIds);
      return NextResponse.json(
        {
          message: 'Stock version is required',
          code: 'MISSING_STOCK_VERSION',
          conflict: {
            currentStockVersion: snapshot.version,
            stock: snapshot.stock,
          },
        },
        { status: 409 }
      );
    }

    const serverStockVersion = getStockVersion();
    if (clientStockVersion !== serverStockVersion) {
      const snapshot = getStockSnapshot(itemIds);
      return NextResponse.json(
        {
          message: 'Stock changed. Please review cart quantities.',
          code: 'STALE_STOCK_VERSION',
          conflict: {
            currentStockVersion: snapshot.version,
            stock: snapshot.stock,
          },
        },
        { status: 409 }
      );
    }

    const rxRequiredNames: string[] = [];

    const normalizedItems = items
      .map((item) => {
        const medicineId = String(item.medicineId ?? '').trim();
        const quantity = Number(item.quantity ?? 0);
        const catalogProduct = landingProducts.find((product) => product.id === medicineId);

        if (!catalogProduct) {
          return null;
        }

        const available = getAvailableStock(catalogProduct.id);
        if (!Number.isFinite(quantity) || quantity <= 0 || quantity > available) {
          return null;
        }

        if (catalogProduct.requiresPrescription) {
          rxRequiredNames.push(catalogProduct.name);
        }

        return {
          medicineId: catalogProduct.id,
          name: catalogProduct.name,
          genericName: catalogProduct.genericName,
          unitPrice: catalogProduct.price,
          quantity,
        } as CustomerOrderItem;
      })
      .filter((item): item is CustomerOrderItem => Boolean(item));

    if (!normalizedItems.length) {
      return NextResponse.json({ message: 'Order items are invalid' }, { status: 400 });
    }

    if (rxRequiredNames.length > 0 && !hasVerifiedPrescription(session.id)) {
      return NextResponse.json(
        {
          message: 'Verified prescription required for selected items.',
          code: 'REQUIRES_PRESCRIPTION',
          prescription: {
            items: rxRequiredNames,
          },
        },
        { status: 403 }
      );
    }

    const calculatedSubtotal = normalizedItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    if (Math.abs(calculatedSubtotal - subtotal) > 1) {
      return NextResponse.json({ message: 'Subtotal mismatch' }, { status: 400 });
    }

    const created = createCustomerOrder({
      user: session,
      address,
      items: normalizedItems,
      subtotal: calculatedSubtotal,
    });

    if (!created.ok) {
      const snapshot = getStockSnapshot(itemIds);
      return NextResponse.json(
        {
          message: created.message,
          code: 'INSUFFICIENT_STOCK',
          conflict: {
            currentStockVersion: snapshot.version,
            stock: snapshot.stock,
          },
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ order: created.order }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }
}
