'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useStoreCart } from '@/hooks/use-store-cart';
import { useToast } from '@/hooks/use-toast';
import type { Medicine } from '@/lib/types';

export function ProductDetailClient({ product }: { product: Medicine }) {
  const [qty, setQty] = useState(1);
  const { addItem } = useStoreCart();
  const { toast } = useToast();

  const handleAdd = () => {
    if (product.quantity <= 0) {
      toast({ variant: 'destructive', title: 'Out of stock', description: `${product.name} is currently unavailable.` });
      return;
    }
    for (let i = 0; i < qty; i++) addItem(product);
    toast({ title: 'Added to cart', description: `${qty}× ${product.name} added to your cart.` });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-xl bg-surface-container">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="rounded-l-xl p-4 transition hover:bg-surface-container-high"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center font-bold">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.quantity, q + 1))}
            disabled={qty >= product.quantity}
            className="rounded-r-xl p-4 transition hover:bg-surface-container-high disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={handleAdd}
          disabled={product.quantity <= 0}
          className="btn-primary-gradient flex flex-1 items-center justify-center gap-2 px-6 py-4 disabled:opacity-50"
        >
          <ShoppingCart className="h-5 w-5" />
          {product.quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
      <button className="w-full rounded-xl border-2 border-stitch-primary-container bg-surface-container-lowest py-4 font-bold text-stitch-primary transition hover:bg-stitch-primary-fixed/10 active:scale-[0.98]">
        Book Consultation
      </button>
    </div>
  );
}
