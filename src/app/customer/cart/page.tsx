'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useStoreCart } from '@/hooks/use-store-cart';
import { useToast } from '@/hooks/use-toast';

type StockConflict = { id: string; name: string; requested: number; available: number };

export default function CustomerCartPage() {
  const { items, subtotal, updateQuantity, removeItem, clear } = useStoreCart();
  const { toast } = useToast();
  const [liveStock, setLiveStock] = useState<Record<string, number>>({});
  const [conflicts, setConflicts] = useState<StockConflict[]>([]);

  const syncStock = useCallback(async () => {
    if (!items.length) { setLiveStock({}); return; }
    try {
      const ids = items.map((i) => i.id).join(',');
      const res = await fetch(`/api/catalog/stock?ids=${encodeURIComponent(ids)}`);
      const payload = (await res.json().catch(() => null)) as { stock?: Record<string, number> } | null;
      const stockMap = payload?.stock ?? {};
      setLiveStock(stockMap);
      const next: StockConflict[] = [];
      for (const item of items) {
        const avail = Number.isFinite(stockMap[item.id]) ? Number(stockMap[item.id]) : item.maxStock;
        if (item.quantity > avail) {
          next.push({ id: item.id, name: item.name, requested: item.quantity, available: avail });
          updateQuantity(item.id, avail);
        }
      }
      setConflicts(next);
      if (next.length) toast({ variant: 'destructive', title: 'Cart adjusted', description: 'Some items were reduced to match current stock.' });
    } catch { /* keep usable */ }
  }, [items, toast, updateQuantity]);

  useEffect(() => {
    void syncStock();
    const id = window.setInterval(syncStock, 30000);
    const onFocus = () => void syncStock();
    const onVis = () => { if (!document.hidden) void syncStock(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    return () => { window.clearInterval(id); window.removeEventListener('focus', onFocus); document.removeEventListener('visibilitychange', onVis); };
  }, [syncStock]);

  const deliveryFee = subtotal > 49900 ? 0 : 4900;
  const total = subtotal + deliveryFee;

  /* ── Empty state ── */
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-stitch-primary-fixed/20">
          <ShoppingBag className="h-12 w-12 text-stitch-primary" />
        </div>
        <h2 className="font-headline text-2xl font-bold text-on-surface">Your cart is empty</h2>
        <p className="mt-2 max-w-xs text-sm text-on-surface-variant">
          Looks like you haven't added any medicines yet. Browse our catalog to get started.
        </p>
        <Link href="/catalog" className="btn-primary-gradient mt-6 px-8 py-3 text-sm">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-extrabold text-on-surface">My Cart</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>
        <button
          onClick={clear}
          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          Clear cart
        </button>
      </div>

      {/* Stock conflicts */}
      {conflicts.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="mb-2 text-sm font-bold text-amber-800">⚠️ Cart was adjusted due to stock changes</p>
          {conflicts.map((c) => (
            <p key={c.id} className="text-xs text-amber-700">
              {c.name}: requested {c.requested}, available {Math.max(0, c.available)}
            </p>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

        {/* ── Cart items ── */}
        <div className="space-y-3">
          {items.map((item) => {
            const available = Number.isFinite(liveStock[item.id]) ? Number(liveStock[item.id]) : item.maxStock;
            const atMax = item.quantity >= available;
            const lineTotal = (item.price * item.quantity) / 100;

            return (
              <div key={item.id} className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-start gap-4">
                  {/* Product icon */}
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-stitch-primary-fixed/20 text-3xl">
                    💊
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-bold text-on-surface">{item.name}</p>
                        <p className="text-xs text-on-surface-variant">{item.genericName}</p>
                        {item.requiresPrescription && (
                          <span className="mt-1 inline-block rounded-full bg-stitch-primary/10 px-2 py-0.5 text-[10px] font-bold text-stitch-primary">Rx Required</span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex-shrink-0 rounded-lg p-1.5 text-on-surface-variant transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Qty controls */}
                      <div className="flex items-center rounded-xl bg-surface-container overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="flex h-9 w-9 items-center justify-center text-on-surface-variant transition hover:bg-surface-container-high disabled:opacity-30"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-on-surface">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={atMax || available <= 0}
                          className="flex h-9 w-9 items-center justify-center text-on-surface-variant transition hover:bg-surface-container-high disabled:opacity-30"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-extrabold text-stitch-primary">
                          {lineTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          {(item.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} each
                        </p>
                      </div>
                    </div>

                    {/* Stock indicator */}
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-container">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (available / 200) * 100)}%`,
                            background: available === 0 ? 'rgb(var(--error))' : available < 10 ? 'rgb(245 158 11)' : 'rgb(var(--stitch-secondary))',
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-on-surface-variant">
                        {available === 0 ? 'Out of stock' : available < 10 ? `Only ${available} left` : `${available} in stock`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Order summary ── */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm space-y-5">
            <h2 className="font-headline text-base font-bold text-on-surface">Order Summary</h2>

            <div className="space-y-3 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-on-surface-variant">
                  <span className="truncate max-w-[160px]">{item.name} ×{item.quantity}</span>
                  <span className="font-medium text-on-surface">
                    {((item.price * item.quantity) / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-outline-variant/20 pt-4 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-semibold text-on-surface">
                  {(subtotal / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Delivery</span>
                <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : 'text-on-surface'}`}>
                  {deliveryFee === 0 ? 'FREE' : (deliveryFee / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-[11px] text-on-surface-variant">
                  Add {((49900 - subtotal) / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} more for free delivery
                </p>
              )}
              <div className="flex justify-between border-t border-outline-variant/20 pt-3 text-base font-extrabold">
                <span className="text-on-surface">Total</span>
                <span className="text-stitch-primary">
                  {(total / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </span>
              </div>
            </div>

            <Link href="/customer/checkout" className="btn-primary-gradient block w-full py-4 text-center text-base">
              Proceed to Checkout →
            </Link>

            <Link href="/catalog" className="block text-center text-sm font-semibold text-on-surface-variant transition hover:text-stitch-primary">
              ← Continue Shopping
            </Link>

            {/* Trust */}
            <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-on-surface-variant">
              <span>🔒 Secure</span>
              <span>·</span>
              <span>✓ Genuine</span>
              <span>·</span>
              <span>🚚 Fast</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
