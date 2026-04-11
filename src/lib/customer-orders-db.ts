import crypto from 'crypto';
import { OrderStatus } from '@prisma/client';
import type { SessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { releaseStock, reserveStock } from '@/lib/catalog-stock';
import type {
  CustomerOrder,
  CustomerOrderItem,
  CustomerOrderStatus,
} from '@/lib/types';

type OrderInput = {
  user: SessionUser;
  address: string;
  items: CustomerOrderItem[];
  subtotal: number;
};

type DbOrder = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  address: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  items: Array<{
    medicineId: string;
    name: string;
    genericName: string;
    unitPrice: number;
    quantity: number;
  }>;
};

function mapOrder(order: DbOrder): CustomerOrder {
  return {
    id: order.id,
    customerId: order.customerId,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    address: order.address,
    items: order.items.map((item) => ({
      medicineId: item.medicineId,
      name: item.name,
      genericName: item.genericName,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    })),
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
    status: order.status as CustomerOrderStatus,
    createdAt: order.createdAt.toISOString(),
  };
}

function buildOrderId(): string {
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const nonce = crypto.randomUUID().slice(0, 6).toUpperCase();
  return `ORD-${stamp}-${nonce}`;
}

export async function createCustomerOrderDb(
  input: OrderInput
): Promise<{ ok: true; order: CustomerOrder } | { ok: false; message: string }> {
  const reservation = reserveStock(
    input.items.map((item) => ({
      medicineId: item.medicineId,
      quantity: item.quantity,
    }))
  );

  if (!reservation.ok) {
    return reservation;
  }

  const deliveryFee = 0;

  try {
    const created = await prisma.order.create({
      data: {
        id: buildOrderId(),
        customerId: input.user.id,
        customerName: input.user.name,
        customerEmail: input.user.email,
        address: input.address,
        subtotal: input.subtotal,
        deliveryFee,
        total: input.subtotal + deliveryFee,
        status: 'Placed',
        items: {
          create: input.items.map((item) => ({
            medicineId: item.medicineId,
            name: item.name,
            genericName: item.genericName,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return { ok: true, order: mapOrder(created) };
  } catch {
    // Undo reservation if persistence fails.
    releaseStock(
      input.items.map((item) => ({
        medicineId: item.medicineId,
        quantity: item.quantity,
      }))
    );
    return { ok: false, message: 'Could not create order' };
  }
}

export async function getOrdersForCustomerDb(customerId: string): Promise<CustomerOrder[]> {
  const orders = await prisma.order.findMany({
    where: { customerId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return orders.map((order) => mapOrder(order));
}

export async function getAllCustomerOrdersDb(): Promise<CustomerOrder[]> {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return orders.map((order) => mapOrder(order));
}

const allowedTransitions: Record<CustomerOrderStatus, CustomerOrderStatus[]> = {
  Placed: ['Processing', 'Cancelled'],
  Processing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

export async function updateCustomerOrderStatusDb(
  id: string,
  nextStatus: CustomerOrderStatus
): Promise<{ ok: true; order: CustomerOrder } | { ok: false; message: string }> {
  const current = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!current) {
    return { ok: false, message: 'Order not found' };
  }

  const currentStatus = current.status as CustomerOrderStatus;

  if (currentStatus === nextStatus) {
    return { ok: true, order: mapOrder(current) };
  }

  if (!allowedTransitions[currentStatus].includes(nextStatus)) {
    return {
      ok: false,
      message: `Cannot change status from ${currentStatus} to ${nextStatus}`,
    };
  }

  if (nextStatus === 'Cancelled') {
    releaseStock(
      current.items.map((item) => ({
        medicineId: item.medicineId,
        quantity: item.quantity,
      }))
    );
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status: nextStatus },
    include: { items: true },
  });

  return { ok: true, order: mapOrder(updated) };
}
