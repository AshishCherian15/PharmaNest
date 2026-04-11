import { prisma } from '@/lib/prisma';
import { ensureCatalogSeeded } from '@/lib/pharmanest-seed';
import type { CartItem } from '@/lib/types';

export type SalesTransaction = {
  id: string;
  amount: number;
  items: number;
  timestamp: string;
};

function buildTransactionId(): string {
  return `TXN${Date.now()}`;
}

export async function getSalesTransactions(): Promise<SalesTransaction[]> {
  await ensureCatalogSeeded();
  const sales = await prisma.salesTransaction.findMany({
    orderBy: { timestamp: 'desc' },
  });

  return sales.map((sale) => ({
    id: sale.id,
    amount: sale.amount,
    items: sale.items,
    timestamp: sale.timestamp.toISOString(),
  }));
}

export async function completeSale(items: CartItem[]): Promise<SalesTransaction> {
  await ensureCatalogSeeded();

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

    const transaction = await tx.salesTransaction.create({
      data: {
        id: buildTransactionId(),
        amount,
        items: items.length,
      },
    });

    await tx.stockState.upsert({
      where: { id: 'catalog' },
      update: { version: { increment: 1 } },
      create: { id: 'catalog', version: 1 },
    });

    return {
      id: transaction.id,
      amount: transaction.amount,
      items: transaction.items,
      timestamp: transaction.timestamp.toISOString(),
    } satisfies SalesTransaction;
  });

  return txResult;
}
