import crypto from 'crypto';
import type {
  CustomerOrder,
  CustomerOrderItem,
  CustomerOrderStatus,
} from '@/lib/types';
import type { SessionUser } from '@/lib/auth';
import { releaseStock, reserveStock } from '@/lib/catalog-stock';

type OrderInput = {
  user: SessionUser;
  address: string;
  items: CustomerOrderItem[];
  subtotal: number;
};

type GlobalStore = {
  __pharmanestCustomerOrders?: CustomerOrder[];
};

function getStore(): CustomerOrder[] {
  const globalStore = globalThis as unknown as GlobalStore;
  if (!globalStore.__pharmanestCustomerOrders) {
    globalStore.__pharmanestCustomerOrders = [];
  }
  return globalStore.__pharmanestCustomerOrders;
}

function buildOrderId(): string {
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const nonce = crypto.randomUUID().slice(0, 6).toUpperCase();
  return `ORD-${stamp}-${nonce}`;
}

export function createCustomerOrder(
  input: OrderInput
): { ok: true; order: CustomerOrder } | { ok: false; message: string } {
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
  const order: CustomerOrder = {
    id: buildOrderId(),
    customerId: input.user.id,
    customerName: input.user.name,
    customerEmail: input.user.email,
    address: input.address,
    items: input.items,
    subtotal: input.subtotal,
    deliveryFee,
    total: input.subtotal + deliveryFee,
    status: 'Placed',
    createdAt: new Date().toISOString(),
  };

  const store = getStore();
  store.unshift(order);
  return { ok: true, order };
}

export function getOrdersForCustomer(customerId: string): CustomerOrder[] {
  return getStore().filter((order) => order.customerId === customerId);
}

export function getAllCustomerOrders(): CustomerOrder[] {
  return [...getStore()];
}

const allowedTransitions: Record<CustomerOrderStatus, CustomerOrderStatus[]> = {
  Placed: ['Processing', 'Cancelled'],
  Processing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

export function updateCustomerOrderStatus(
  id: string,
  nextStatus: CustomerOrderStatus
): { ok: true; order: CustomerOrder } | { ok: false; message: string } {
  const store = getStore();
  const index = store.findIndex((order) => order.id === id);

  if (index === -1) {
    return { ok: false, message: 'Order not found' };
  }

  const current = store[index];
  if (current.status === nextStatus) {
    return { ok: true, order: current };
  }

  if (!allowedTransitions[current.status].includes(nextStatus)) {
    return {
      ok: false,
      message: `Cannot change status from ${current.status} to ${nextStatus}`,
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

  const updated = { ...current, status: nextStatus };
  store[index] = updated;
  return { ok: true, order: updated };
}
