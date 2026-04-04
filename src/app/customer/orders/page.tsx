import Link from 'next/link';
import { cookies } from 'next/headers';
import { AUTH_COOKIE, parseSessionToken } from '@/lib/auth';
import { getOrdersForCustomer } from '@/lib/customer-orders';
import type { CustomerOrderStatus } from '@/lib/types';

const statusConfig: Record<CustomerOrderStatus, { label: string; color: string; icon: string }> = {
  Placed:     { label: 'Order Placed',  color: 'bg-blue-100 text-blue-700',   icon: '📋' },
  Processing: { label: 'Processing',    color: 'bg-amber-100 text-amber-700', icon: '⚙️' },
  Shipped:    { label: 'Shipped',       color: 'bg-purple-100 text-purple-700', icon: '🚚' },
  Delivered:  { label: 'Delivered',     color: 'bg-green-100 text-green-700', icon: '✅' },
  Cancelled:  { label: 'Cancelled',     color: 'bg-red-100 text-red-700',     icon: '❌' },
};

export default async function CustomerOrdersPage() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);
  const orders = session ? getOrdersForCustomer(session.id) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-extrabold text-on-surface">My Orders</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/catalog" className="rounded-xl bg-stitch-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-stitch-primary-container">
          + New Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-16 text-center shadow-sm">
          <p className="text-5xl mb-4">📦</p>
          <p className="font-bold text-on-surface">No orders yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">Start shopping to see your orders here.</p>
          <Link href="/catalog" className="mt-5 inline-block rounded-xl bg-stitch-primary px-6 py-2.5 text-sm font-bold text-white">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] ?? statusConfig.Placed;
            return (
              <div key={order.id} className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm transition hover:shadow-md">
                {/* Order header */}
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Order ID</p>
                    <p className="font-headline font-bold text-on-surface">#{order.id}</p>
                  </div>
                  <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${status.color}`}>
                    <span>{status.icon}</span>
                    {status.label}
                  </span>
                </div>

                {/* Items */}
                <div className="mb-4 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.medicineId} className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2 text-sm">
                      <div>
                        <p className="font-semibold text-on-surface">{item.name}</p>
                        <p className="text-xs text-on-surface-variant">{item.genericName} · Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-stitch-primary">
                        {(item.unitPrice * item.quantity / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant/20 pt-3">
                  <div className="text-xs text-on-surface-variant">
                    <p>📅 {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    <p className="mt-0.5 truncate max-w-[200px]">📍 {order.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-on-surface-variant">Total</p>
                    <p className="font-headline text-lg font-extrabold text-stitch-primary">
                      {(order.total / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
