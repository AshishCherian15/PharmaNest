'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Medicine } from '@/lib/types';

const CART_STORAGE_KEY = 'pharmanest-store-cart';
const CART_EVENT = 'pharmanest-cart-updated';

export type StoreCartItem = {
  id: string;
  name: string;
  price: number;
  imageId: string;
  genericName: string;
  requiresPrescription?: boolean;
  maxStock: number;
  quantity: number;
};

function readCart(): StoreCartItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoreCartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: StoreCartItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function useStoreCart() {
  const [items, setItems] = useState<StoreCartItem[]>([]);

  const sync = useCallback(() => {
    setItems(readCart());
  }, []);

  useEffect(() => {
    sync();

    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) {
        sync();
      }
    };

    const onCartUpdated = () => sync();

    window.addEventListener('storage', onStorage);
    window.addEventListener(CART_EVENT, onCartUpdated);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(CART_EVENT, onCartUpdated);
    };
  }, [sync]);

  const addItem = useCallback((product: Medicine) => {
    if (product.quantity <= 0) {
      return;
    }

    const current = readCart();
    const existing = current.find((item) => item.id === product.id);

    if (existing) {
      const nextMaxStock = Math.max(0, product.quantity);
      const nextQty = Math.min(existing.quantity + 1, nextMaxStock);
      writeCart(
        current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                maxStock: nextMaxStock,
                quantity: nextQty,
              }
            : item
        )
      );
      return;
    }

    writeCart([
      {
        id: product.id,
        name: product.name,
        price: product.price,
        imageId: product.imageId,
        genericName: product.genericName,
        requiresPrescription: product.requiresPrescription,
        maxStock: product.quantity,
        quantity: 1,
      },
      ...current,
    ]);
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const current = readCart();
    const next = current
      .map((item) => {
        if (item.id !== id) return item;
        const bounded = Math.max(0, Math.min(quantity, item.maxStock));
        return { ...item, quantity: bounded };
      })
      .filter((item) => item.quantity > 0);

    writeCart(next);
  }, []);

  const removeItem = useCallback((id: string) => {
    writeCart(readCart().filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => {
    writeCart([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return {
    items,
    itemCount,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clear,
  };
}
