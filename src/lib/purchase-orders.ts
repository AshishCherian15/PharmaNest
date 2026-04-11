import { prisma } from '@/lib/prisma';
import type { PurchaseOrder } from '@/lib/types';

export type CreatePurchaseOrderInput = {
  supplierId: string;
  total: number;
  expectedDeliveryDate?: string;
};

type DbPurchaseOrder = {
  id: string;
  orderNo: string;
  orderDate: Date;
  expectedDeliveryDate: Date | null;
  status: string;
  total: number;
  supplier: {
    name: string;
  };
};

function mapPurchaseOrder(order: DbPurchaseOrder): PurchaseOrder {
  return {
    id: order.orderNo,
    supplierName: order.supplier.name,
    orderDate: order.orderDate.toISOString().slice(0, 10),
    expectedDate: order.expectedDeliveryDate
      ? order.expectedDeliveryDate.toISOString().slice(0, 10)
      : '-',
    status: (order.status as PurchaseOrder['status']) ?? 'Pending',
    total: order.total,
  };
}

function buildOrderNo(): string {
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const nonce = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PO-${stamp}-${nonce}`;
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  const orders = await prisma.purchaseOrder.findMany({
    include: {
      supplier: {
        select: { name: true },
      },
    },
    orderBy: { orderDate: 'desc' },
  });

  return orders.map((order) => mapPurchaseOrder(order));
}

export async function createPurchaseOrder(input: CreatePurchaseOrderInput): Promise<PurchaseOrder> {
  const created = await prisma.purchaseOrder.create({
    data: {
      supplierId: input.supplierId,
      orderNo: buildOrderNo(),
      total: input.total,
      status: 'Pending',
      expectedDeliveryDate: input.expectedDeliveryDate ? new Date(input.expectedDeliveryDate) : null,
    },
    include: {
      supplier: {
        select: { name: true },
      },
    },
  });

  return mapPurchaseOrder(created);
}
