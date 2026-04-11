import { beforeEach, describe, expect, it, vi } from 'vitest';
import { completeSale, getSalesTransactions } from '@/lib/sales';

vi.mock('@/lib/sales', () => ({
  completeSale: vi.fn(),
  getSalesTransactions: vi.fn(),
}));

vi.mock('@/lib/api-logger', () => ({
  requestLogger: {
    logResponse: vi.fn(),
    logError: vi.fn(),
  },
}));

import { GET, POST } from './route';

describe('admin sales route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns sales history on GET', async () => {
    vi.mocked(getSalesTransactions).mockResolvedValue([
      {
        id: 'TXN1001',
        amount: 3500,
        items: 2,
        timestamp: '2026-04-10T10:00:00.000Z',
      },
    ]);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.sales).toHaveLength(1);
  });

  it('rejects empty cart on POST', async () => {
    const res = await POST(
      new Request('http://localhost/api/admin/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [] }),
      })
    );

    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.code).toBe('EMPTY_CART');
  });

  it('completes sale and returns transaction on POST', async () => {
    vi.mocked(completeSale).mockResolvedValue({
      id: 'TXN1002',
      amount: 9900,
      items: 3,
      timestamp: '2026-04-10T11:00:00.000Z',
    });

    const res = await POST(
      new Request('http://localhost/api/admin/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            { medicineId: 'med_1', name: 'Paracetamol', price: 3300, quantity: 1, stock: 10 },
            { medicineId: 'med_2', name: 'Cetirizine', price: 3300, quantity: 2, stock: 20 },
          ],
        }),
      })
    );

    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.transaction.id).toBe('TXN1002');
    expect(completeSale).toHaveBeenCalledTimes(1);
  });
});
