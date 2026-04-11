import type { Medicine } from '@/lib/types';
import { landingProducts, mockMedicines } from '@/lib/data';
import { removeStockForProduct, upsertStockForProduct } from '@/lib/catalog-stock';

type GlobalProductStore = {
  __pharmanestProducts?: Medicine[];
};

function normalizeProducts(): Medicine[] {
  const map = new Map<string, Medicine>();
  for (const product of [...landingProducts, ...mockMedicines]) {
    map.set(product.id, { ...product });
  }
  return Array.from(map.values());
}

function getStore(): Medicine[] {
  const globalStore = globalThis as unknown as GlobalProductStore;
  if (!globalStore.__pharmanestProducts) {
    globalStore.__pharmanestProducts = normalizeProducts();
  }
  return globalStore.__pharmanestProducts;
}

export function getAllProducts(): Medicine[] {
  return [...getStore()];
}

export function getProductById(id: string): Medicine | undefined {
  return getStore().find((product) => product.id === id);
}

export function createProduct(input: Medicine): Medicine {
  const store = getStore();
  const exists = store.some((item) => item.id === input.id);
  const id = exists ? `MED${Date.now()}` : input.id;
  const created = { ...input, id };
  store.unshift(created);
  upsertStockForProduct(created.id, created.quantity);
  return created;
}

export function updateProduct(id: string, input: Medicine): Medicine | null {
  const store = getStore();
  const index = store.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const updated = { ...input, id };
  store[index] = updated;
  upsertStockForProduct(updated.id, updated.quantity);
  return updated;
}

export function deleteProduct(id: string): boolean {
  const store = getStore();
  const before = store.length;
  const next = store.filter((item) => item.id !== id);
  if (next.length === before) return false;

  const globalStore = globalThis as unknown as GlobalProductStore;
  globalStore.__pharmanestProducts = next;
  removeStockForProduct(id);
  return true;
}
