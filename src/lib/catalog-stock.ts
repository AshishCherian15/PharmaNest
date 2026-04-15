import { prisma } from '@/lib/prisma';
import { ensureCatalogSeeded } from '@/lib/pharmanest-seed';
import { isDemoModeEnabled } from '@/lib/demo-mode';
import { bumpDemoStockVersion, getDemoStore } from '@/lib/demo/demo-store';

async function bumpVersion(tx?: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]): Promise<void> {
  const db = tx ?? prisma;
  await db.stockState.upsert({
    where: { id: 'catalog' },
    update: { version: { increment: 1 } },
    create: { id: 'catalog', version: 1 },
  });
}

export async function getAvailableStock(medicineId: string): Promise<number> {
  if (isDemoModeEnabled()) {
    return getDemoStore().products.find((medicine) => medicine.id === medicineId)?.quantity ?? 0;
  }

  await ensureCatalogSeeded();
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    select: { quantity: true },
  });

  return medicine?.quantity ?? 0;
}

export async function getStockVersion(): Promise<number> {
  if (isDemoModeEnabled()) {
    return getDemoStore().stockVersion;
  }

  await ensureCatalogSeeded();
  const state = await prisma.stockState.findUnique({ where: { id: 'catalog' } });
  return state?.version ?? 1;
}

export async function getStockSnapshot(ids: string[]): Promise<{
  stock: Record<string, number>;
  version: number;
}> {
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const stock = ids.reduce<Record<string, number>>((acc, id) => {
      acc[id] = store.products.find((medicine) => medicine.id === id)?.quantity ?? 0;
      return acc;
    }, {});

    return {
      stock,
      version: store.stockVersion,
    };
  }

  await ensureCatalogSeeded();
  const medicines = await prisma.medicine.findMany({
    where: { id: { in: ids } },
    select: { id: true, quantity: true },
  });
  const stockMap = new Map(medicines.map((medicine) => [medicine.id, medicine.quantity]));
  const stock = ids.reduce<Record<string, number>>((acc, id) => {
    acc[id] = stockMap.get(id) ?? 0;
    return acc;
  }, {});

  return {
    stock,
    version: await getStockVersion(),
  };
}

export async function reserveStock(
  items: Array<{ medicineId: string; quantity: number }>
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    for (const item of items) {
      const medicine = store.products.find((product) => product.id === item.medicineId);
      if (!medicine || item.quantity > medicine.quantity) {
        return { ok: false, message: `Insufficient stock for ${item.medicineId}` };
      }
    }

    for (const item of items) {
      const medicine = store.products.find((product) => product.id === item.medicineId);
      if (!medicine) continue;
      medicine.quantity -= item.quantity;
    }

    bumpDemoStockVersion();
    return { ok: true };
  }

  await ensureCatalogSeeded();

  if (!items.length) {
    return { ok: true };
  }

  try {
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const medicine = await tx.medicine.findUnique({
          where: { id: item.medicineId },
          select: { quantity: true },
        });

        if (!medicine || item.quantity > medicine.quantity) {
          throw new Error(`Insufficient stock for ${item.medicineId}`);
        }
      }

      for (const item of items) {
        const medicine = await tx.medicine.findUnique({
          where: { id: item.medicineId },
          select: { quantity: true },
        });

        if (!medicine) {
          throw new Error(`Medicine not found: ${item.medicineId}`);
        }

        await tx.medicine.update({
          where: { id: item.medicineId },
          data: { quantity: medicine.quantity - item.quantity },
        });
      }

      await bumpVersion(tx);
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Unable to reserve stock',
    };
  }
}

export async function releaseStock(items: Array<{ medicineId: string; quantity: number }>): Promise<void> {
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    for (const item of items) {
      const medicine = store.products.find((product) => product.id === item.medicineId);
      if (!medicine) continue;
      medicine.quantity += item.quantity;
    }
    bumpDemoStockVersion();
    return;
  }

  await ensureCatalogSeeded();

  if (!items.length) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const medicine = await tx.medicine.findUnique({
        where: { id: item.medicineId },
        select: { quantity: true },
      });

      if (!medicine) continue;

      await tx.medicine.update({
        where: { id: item.medicineId },
        data: { quantity: medicine.quantity + item.quantity },
      });
    }

    await bumpVersion(tx);
  });
}

export async function upsertStockForProduct(medicineId: string, quantity: number): Promise<void> {
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const medicine = store.products.find((product) => product.id === medicineId);
    if (medicine) {
      medicine.quantity = Math.max(0, Number(quantity) || 0);
      bumpDemoStockVersion();
    }
    return;
  }

  await ensureCatalogSeeded();
  await prisma.medicine.update({
    where: { id: medicineId },
    data: { quantity: Math.max(0, Number(quantity) || 0) },
  });
  await bumpVersion();
}

export async function removeStockForProduct(medicineId: string): Promise<void> {
  if (isDemoModeEnabled()) {
    const store = getDemoStore();
    const medicine = store.products.find((product) => product.id === medicineId);
    if (medicine) {
      medicine.quantity = 0;
      bumpDemoStockVersion();
    }
    return;
  }

  await ensureCatalogSeeded();
  await prisma.stockState.upsert({
    where: { id: 'catalog' },
    update: { version: { increment: 1 } },
    create: { id: 'catalog', version: 1 },
  });
  await prisma.medicine.update({
    where: { id: medicineId },
    data: { quantity: 0 },
  });
}
