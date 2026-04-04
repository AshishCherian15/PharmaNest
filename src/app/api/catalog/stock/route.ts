import { NextResponse } from 'next/server';
import { landingProducts } from '@/lib/data';
import { getStockSnapshot } from '@/lib/catalog-stock';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const idsParam = url.searchParams.get('ids');

  const ids = idsParam
    ? idsParam
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
    : landingProducts.map((product) => product.id);

  const { stock, version } = getStockSnapshot(ids);

  return NextResponse.json({ stock, version });
}
