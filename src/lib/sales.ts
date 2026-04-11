import { prisma } from '@/lib/prisma';
import type { CartItem } from '@/lib/types';

export type SalesTransaction = {
  id: string;
  amount: number;
  items: number;
  timestamp: string;
};

type GlobalStore = {
  __pharmanestSalesTransactions?: SalesTransaction[];
};

function getStore(): SalesTransaction[] {
  const globalStore = globalThis as unknown as GlobalStore;
  if (!globalStore.__pharmanestSalesTransactions) {
    globalStore.__pharmanestSalesTransactions = [];
  }
  return globalStore.__pharmanestSalesTransactions;
}

function buildTransactionId(): string {
  return `TXN${Date.now()}`;
}

export function getSalesTransactions(): SalesTransaction[] {
  return [...getStore()];
}

export async function completeSale(items: CartItem[]): Promise<SalesTransaction> {
  const txResult = await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const med = await tx.medicine.findUnique({ where: { id: item.medicineId } });
      if (!med) {
        throw new Error(`Medicine not found: ${item.name}`);
      }
      if (med.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }

      await tx.medicine.update({
        where: { id: item.medicineId },
        data: { quantity: med.quantity - item.quantity },
      });
    }

    const amount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const transaction: SalesTransaction = {
      id: buildTransactionId(),
      amount,
      items: items.length,
      timestamp: new Date().toISOString(),
    };

    const store = getStore();
    store.unshift(transaction);

    return transaction;
  });

  return txResult;
}
