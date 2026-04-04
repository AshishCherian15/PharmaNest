import { landingProducts } from '@/lib/data';

type StockMap = Record<string, number>;

type GlobalStore = {
  __pharmanestCatalogStock?: StockMap;
  __pharmanestCatalogStockVersion?: number;
};

function createInitialStockMap(): StockMap {
  return landingProducts.reduce<StockMap>((acc, product) => {
    acc[product.id] = product.quantity;
    return acc;
  }, {});
}

function getStockStore(): StockMap {
  const globalStore = globalThis as unknown as GlobalStore;
  if (!globalStore.__pharmanestCatalogStock) {
    globalStore.__pharmanestCatalogStock = createInitialStockMap();
  }
  if (!Number.isFinite(globalStore.__pharmanestCatalogStockVersion)) {
    globalStore.__pharmanestCatalogStockVersion = 1;
  }
  return globalStore.__pharmanestCatalogStock;
}

function getGlobalStore(): GlobalStore {
  const globalStore = globalThis as unknown as GlobalStore;
  getStockStore();
  return globalStore;
}

export function getAvailableStock(medicineId: string): number {
  const stock = getStockStore()[medicineId];
  return Number.isFinite(stock) ? stock : 0;
}

export function getStockVersion(): number {
  const globalStore = getGlobalStore();
  return Number(globalStore.__pharmanestCatalogStockVersion);
}

export function getStockSnapshot(ids: string[]): {
  stock: Record<string, number>;
  version: number;
} {
  const stock = ids.reduce<Record<string, number>>((acc, id) => {
    acc[id] = getAvailableStock(id);
    return acc;
  }, {});

  return {
    stock,
    version: getStockVersion(),
  };
}

export function reserveStock(
  items: Array<{ medicineId: string; quantity: number }>
): { ok: true } | { ok: false; message: string } {
  if (!items.length) {
    return { ok: true };
  }

  const store = getStockStore();

  for (const item of items) {
    const available = getAvailableStock(item.medicineId);
    if (item.quantity > available) {
      return {
        ok: false,
        message: `Insufficient stock for ${item.medicineId}. Available: ${available}`,
      };
    }
  }

  for (const item of items) {
    store[item.medicineId] = getAvailableStock(item.medicineId) - item.quantity;
  }

  const globalStore = getGlobalStore();
  globalStore.__pharmanestCatalogStockVersion = getStockVersion() + 1;

  return { ok: true };
}

export function releaseStock(items: Array<{ medicineId: string; quantity: number }>): void {
  if (!items.length) {
    return;
  }

  const store = getStockStore();
  for (const item of items) {
    store[item.medicineId] = getAvailableStock(item.medicineId) + item.quantity;
  }

  const globalStore = getGlobalStore();
  globalStore.__pharmanestCatalogStockVersion = getStockVersion() + 1;
}
