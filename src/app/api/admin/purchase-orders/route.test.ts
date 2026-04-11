import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPurchaseOrder, getPurchaseOrders } from '@/lib/purchase-orders';

vi.mock('@/lib/purchase-orders', () => ({
  createPurchaseOrder: vi.fn(),
  getPurchaseOrders: vi.fn(),
}));

vi.mock('@/lib/api-logger', () => ({
  requestLogger: {
    logResponse: vi.fn(),
    logError: vi.fn(),
  },
}));

import { GET, POST } from './route';

describe('admin purchase-orders route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns purchase orders on GET', async () => {
    vi.mocked(getPurchaseOrders).mockResolvedValue([
      {
        id: 'PO-250410-ABC123',
        supplierName: 'Global Pharma',
        orderDate: '2026-04-10',
        expectedDate: '2026-04-20',
        status: 'Pending',
        total: 100000,
      },
    ]);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.orders).toHaveLength(1);
  });

  it('validates supplierId and total on POST', async () => {
    const invalidSupplierRes = await POST(
      new Request('http://localhost/api/admin/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplierId: '', total: 1000 }),
      })
    );

    expect(invalidSupplierRes.status).toBe(400);

    const invalidTotalRes = await POST(
      new Request('http://localhost/api/admin/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplierId: 'sup_1', total: -10 }),
      })
    );

    expect(invalidTotalRes.status).toBe(400);
  });

  it('creates purchase order on valid POST', async () => {
    vi.mocked(createPurchaseOrder).mockResolvedValue({
      id: 'PO-250410-ZYX789',
      supplierName: 'MedLife Supplies',
      orderDate: '2026-04-10',
      expectedDate: '2026-04-18',
      status: 'Pending',
      total: 49900,
    });

    const res = await POST(
      new Request('http://localhost/api/admin/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId: 'sup_2',
          total: 49900,
          expectedDeliveryDate: '2026-04-18',
        }),
      })
    );

    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.order.id).toContain('PO-');
    expect(createPurchaseOrder).toHaveBeenCalledTimes(1);
  });
});
