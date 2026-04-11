'use client';

import Link from 'next/link';
import { ShoppingCart, Check } from 'lucide-react';
import type { Medicine } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useStoreCart } from '@/hooks/use-store-cart';
import { useToast } from '@/hooks/use-toast';
import { ProductImage } from '@/components/ui/product-image';

interface ProductCardProps {
  product: Medicine;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const { addItem } = useStoreCart();
  const { toast }   = useToast();

  const discount = product.previousPrice
    ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
    : null;

  const isOutOfStock = product.quantity === 0;
  const isLowStock   = product.quantity > 0 && product.quantity < 10;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      toast({ variant: 'destructive', title: 'Out of stock', description: `${product.name} is currently unavailable.` });
      return;
    }
    addItem(product);
    setAdded(true);
    toast({ title: '✓ Added to cart', description: product.name });
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/products/${product.id}`} className={cn('group block', className)}>
      <div className="stitch-product-card card-lift border border-outline-variant/20 shadow-sm h-full flex flex-col">

        {/* ── Image ── */}
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-low">
          <ProductImage
            imageId={product.imageId}
            name={product.name}
            category={product.category}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {discount && (
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                -{discount}%
              </span>
            )}
            {product.isNew && !discount && (
              <span className="rounded-full bg-stitch-primary px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                NEW
              </span>
            )}
            {isLowStock && (
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                Low stock
              </span>
            )}
          </div>

          {product.requiresPrescription && (
            <span className="absolute right-2 top-2 rounded-full bg-stitch-primary/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              Rx
            </span>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-on-surface">Out of Stock</span>
            </div>
          )}

          {/* BESTSELLER badge */}
          {!isOutOfStock && !product.isNew && !discount && product.reviews && product.reviews > 100 && (
            <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-stitch-primary shadow-sm backdrop-blur-sm">
              BESTSELLER
            </span>
          )}
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 flex-col p-4 space-y-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stitch-secondary">{product.category}</p>
            <h3 className="mt-0.5 line-clamp-2 text-[13px] font-bold leading-snug text-on-surface group-hover:text-stitch-primary transition-colors">
              {product.name}
            </h3>
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-[10px] ${i < Math.floor(product.rating!) ? 'text-amber-400' : 'text-outline/30'}`}>★</span>
                ))}
              </div>
              {product.reviews && (
                <span className="text-[10px] text-outline">({product.reviews})</span>
              )}
            </div>
          )}

          {/* Price + cart */}
          <div className="mt-auto flex items-end justify-between gap-2 pt-1">
            <div>
              <p className="text-[15px] font-extrabold text-stitch-primary">
                {(product.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
              </p>
              {product.previousPrice && (
                <p className="text-[11px] text-outline line-through">
                  {(product.previousPrice / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </p>
              )}
            </div>
            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={cn(
                'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-white transition-all active:scale-90 disabled:opacity-40 btn-interactive',
                added
                  ? 'bg-green-500 scale-95'
                  : 'bg-stitch-primary hover:bg-stitch-primary-container'
              )}
              title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
            >
              {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
