'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStoreCart } from '@/hooks/use-store-cart';
import { useToast } from '@/hooks/use-toast';
import type { CustomerOrderItem } from '@/lib/types';

type StockConflict = { id: string; name: string; requested: number; available: number };

export default function CustomerCheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, subtotal, clear, updateQuantity } = useStoreCart();
  const [address, setAddress]           = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [liveStock, setLiveStock]       = useState<Record<string, number>>({});
  const [stockVersion, setStockVersion] = useState(0);
  const [conflicts, setConflicts]       = useState<StockConflict[]>([]);
  const [prescriptionEligible, setPrescriptionEligible] = useState<boolean | null>(null);

  const syncStock = useCallback(async () => {
    if (!items.length) { setLiveStock({}); return; }
    try {
      const ids = items.map((i) => i.id).join(',');
      const res = await fetch(`/api/catalog/stock?ids=${encodeURIComponent(ids)}`);
      const payload = (await res.json().catch(() => null)) as { stock?: Record<string, number>; version?: number } | null;
      const stockMap = payload?.stock ?? {};
      setLiveStock(stockMap);
      if (payload?.version) setStockVersion(Number(payload.version));
      const next: StockConflict[] = [];
      for (const item of items) {
        const avail = Number.isFinite(stockMap[item.id]) ? Number(stockMap[item.id]) : item.maxStock;
        if (item.quantity > avail) { next.push({ id: item.id, name: item.name, requested: item.quantity, available: avail }); updateQuantity(item.id, avail); }
      }
      setConflicts(next);
      if (next.length) toast({ variant: 'destructive', title: 'Cart adjusted', description: 'Some items were reduced to match current stock.' });
    } catch { /* keep usable */ }
  }, [items, toast, updateQuantity]);

  useEffect(() => {
    void syncStock();
    const id = window.setInterval(syncStock, 30000);
    const onFocus = () => void syncStock();
    window.addEventListener('focus', onFocus);
    return () => { window.clearInterval(id); window.removeEventListener('focus', onFocus); };
  }, [syncStock]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/customer/prescriptions/eligibility')
      .then((r) => r.json())
      .then((d: { eligibility?: { hasVerifiedPrescription?: boolean } }) => { if (mounted) setPrescriptionEligible(Boolean(d?.eligibility?.hasVerifiedPrescription)); })
      .catch(() => { if (mounted) setPrescriptionEligible(null); });
    return () => { mounted = false; };
  }, []);

  const hasRxItems = useMemo(() => items.some((i) => i.requiresPrescription), [items]);
  const lowStockWarnings = useMemo(() =>
    items.flatMap((item) => {
      const avail = Number.isFinite(liveStock[item.id]) ? Number(liveStock[item.id]) : item.maxStock;
      return avail <= 5 ? [`${item.name}: only ${Math.max(0, avail)} left`] : [];
    }), [items, liveStock]);

  const deliveryFee = subtotal > 49900 ? 0 : 4900;
  const total = subtotal + deliveryFee;

  const placeOrder = async () => {
    if (!items.length) { toast({ variant: 'destructive', title: 'Cart is empty' }); return; }
    if (!address.trim()) { toast({ variant: 'destructive', title: 'Address required', description: 'Please enter your delivery address.' }); return; }
    setPlacingOrder(true);
    try {
      const orderItems: CustomerOrderItem[] = items.map((i) => ({ medicineId: i.id, name: i.name, genericName: i.genericName, unitPrice: i.price, quantity: i.quantity }));
      const res = await fetch('/api/customer/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, subtotal, stockVersion, items: orderItems }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string; code?: string; conflict?: { currentStockVersion?: number; stock?: Record<string, number> } } | null;
        if (res.status === 403 && data?.code === 'REQUIRES_PRESCRIPTION') {
          toast({ variant: 'destructive', title: 'Prescription required', description: 'Please verify your prescription before ordering Rx items.' });
          router.push('/customer/prescriptions');
          setPlacingOrder(false);
          return;
        }
        throw new Error(data?.message ?? 'Could not place order');
      }
      clear();
      toast({ title: '🎉 Order placed!', description: 'Your medicines will be delivered soon.' });
      router.push('/customer/orders');
      router.refresh();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Order failed', description: err instanceof Error ? err.message : 'Please try again.' });
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="font-headline text-2xl font-bold text-on-surface">Your cart is empty</h2>
        <p className="mt-2 text-sm text-on-surface-variant">Add some medicines before checking out.</p>
        <Link href="/catalog" className="mt-6 rounded-xl bg-stitch-primary px-8 py-3 font-bold text-white transition hover:bg-stitch-primary-container">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-extrabold text-on-surface">Checkout</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Review your order and complete your purchase.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

        {/* ── Left: delivery + payment ── */}
        <div className="space-y-5">

          {/* Conflicts */}
          {conflicts.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="mb-2 text-sm font-bold text-red-800">⚠️ Stock conflicts — cart was adjusted</p>
              {conflicts.map((c) => (
                <p key={c.id} className="text-xs text-red-700">{c.name}: requested {c.requested}, available {Math.max(0, c.available)}</p>
              ))}
            </div>
          )}

          {/* Low stock warnings */}
          {lowStockWarnings.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="mb-1 text-sm font-bold text-amber-800">⚡ Low stock alert</p>
              {lowStockWarnings.map((w) => <p key={w} className="text-xs text-amber-700">{w}</p>)}
            </div>
          )}

          {/* Rx check */}
          {hasRxItems && (
            <div className={`rounded-xl border p-4 ${prescriptionEligible ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
              <p className={`text-sm font-bold ${prescriptionEligible ? 'text-green-800' : 'text-amber-800'}`}>
                {prescriptionEligible ? '✅ Prescription verified' : '⚠️ Prescription required for Rx items'}
              </p>
              {!prescriptionEligible && (
                <Link href="/customer/prescriptions" className="mt-1 text-xs font-semibold text-amber-700 underline">
                  Upload prescription →
                </Link>
              )}
            </div>
          )}

          {/* Delivery address */}
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="font-headline mb-4 text-base font-bold text-on-surface">📍 Delivery Address</h2>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              placeholder="Enter your complete delivery address including flat/house number, street, city, pincode…"
              className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-sm outline-none transition focus:border-stitch-primary focus:ring-2 focus:ring-stitch-primary/20 resize-none"
            />
          </div>

          {/* Payment method */}
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="font-headline mb-4 text-base font-bold text-on-surface">💳 Payment Method</h2>
            <div className="flex items-center gap-3 rounded-xl bg-stitch-primary-fixed/10 px-4 py-3">
              <span className="text-xl">💵</span>
              <div>
                <p className="text-sm font-bold text-stitch-primary">Cash on Delivery</p>
                <p className="text-xs text-on-surface-variant">Pay when your order arrives</p>
              </div>
              <span className="ml-auto rounded-full bg-stitch-primary-fixed px-2 py-0.5 text-[10px] font-bold text-stitch-primary">DEMO</span>
            </div>
          </div>

          {/* Order items */}
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="font-headline mb-4 text-base font-bold text-on-surface">🛒 Order Items ({items.length})</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl bg-surface-container-low px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-on-surface">{item.name}</p>
                    <p className="text-xs text-on-surface-variant">{item.genericName} · Qty: {item.quantity}</p>
                  </div>
                  <p className="ml-4 font-bold text-stitch-primary">
                    {((item.price * item.quantity) / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: order summary ── */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm space-y-4">
            <h2 className="font-headline text-base font-bold text-on-surface">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold text-on-surface">{(subtotal / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
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
              <div className="flex justify-between border-t border-outline-variant/20 pt-3 text-base font-extrabold text-on-surface">
                <span>Total</span>
                <span className="text-stitch-primary">{(total / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={placingOrder}
              className="btn-primary-gradient w-full py-4 text-base disabled:opacity-60"
            >
              {placingOrder ? '⏳ Placing order…' : '🎉 Place Order'}
            </button>

            <Link href="/customer/cart" className="block text-center text-sm font-semibold text-on-surface-variant hover:text-stitch-primary transition">
              ← Edit Cart
            </Link>

            <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-on-surface-variant">
              <span>🔒 Secure checkout</span>
              <span>·</span>
              <span>✓ 100% genuine</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
