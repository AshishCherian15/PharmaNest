'use client';

import * as React from 'react';
import type { CustomerOrder, CustomerOrderStatus, PurchaseOrder, Supplier } from '@/lib/types';
import { OrderFormDialog } from './_components/add-order-dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, PlusCircle } from 'lucide-react';

const statusColors: Record<string, string> = {
  Pending:    'bg-amber-100 text-amber-800 border-amber-200',
  Shipped:    'bg-purple-100 text-purple-800 border-purple-200',
  Received:   'bg-green-100 text-green-800 border-green-200',
  Cancelled:  'bg-red-100 text-red-800 border-red-200',
  Placed:     'bg-blue-100 text-blue-800 border-blue-200',
  Processing: 'bg-amber-100 text-amber-800 border-amber-200',
  Delivered:  'bg-green-100 text-green-800 border-green-200',
};

const borderColors: Record<string, string> = {
  Pending:    'border-l-amber-500',
  Shipped:    'border-l-purple-500',
  Received:   'border-l-green-500',
  Cancelled:  'border-l-red-500',
  Placed:     'border-l-blue-500',
  Processing: 'border-l-amber-500',
  Delivered:  'border-l-green-500',
};

const nextStatusOptions: Record<CustomerOrderStatus, CustomerOrderStatus[]> = {
  Placed:     ['Processing', 'Cancelled'],
  Processing: ['Shipped', 'Cancelled'],
  Shipped:    ['Delivered'],
  Delivered:  [],
  Cancelled:  [],
};

export default function OrdersPage() {
  const { toast } = useToast();
  const [purchaseOrders, setPurchaseOrders] = React.useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
  const [customerOrders, setCustomerOrders] = React.useState<CustomerOrder[]>([]);
  const [loadingCO, setLoadingCO]           = React.useState(true);
  const [loadingPO, setLoadingPO]           = React.useState(true);
  const [updatingId, setUpdatingId]         = React.useState<string | null>(null);
  const [isFormOpen, setFormOpen]           = React.useState(false);
  const [tab, setTab]                       = React.useState<'customer' | 'purchase'>('customer');
  const [search, setSearch]                 = React.useState('');

  const loadPurchaseOrders = React.useCallback(async () => {
    setLoadingPO(true);
    try {
      const res = await fetch('/api/admin/purchase-orders', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load purchase orders');
      const data = (await res.json()) as { orders?: PurchaseOrder[] };
      setPurchaseOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch {
      toast({ variant: 'destructive', title: 'Could not load purchase orders' });
    } finally {
      setLoadingPO(false);
    }
  }, [toast]);

  const loadSuppliers = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/suppliers', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load suppliers');
      const data = (await res.json()) as { suppliers?: Supplier[] };
      setSuppliers(Array.isArray(data.suppliers) ? data.suppliers : []);
    } catch {
      toast({ variant: 'destructive', title: 'Could not load suppliers' });
    }
  }, [toast]);

  React.useEffect(() => {
    void loadPurchaseOrders();
    void loadSuppliers();
  }, [loadPurchaseOrders, loadSuppliers]);

  React.useEffect(() => {
    let mounted = true;
    setLoadingCO(true);
    fetch('/api/admin/customer-orders')
      .then((r) => r.json())
      .then((d: { orders?: CustomerOrder[] }) => { if (mounted) setCustomerOrders(Array.isArray(d.orders) ? d.orders : []); })
      .catch(() => { if (mounted) toast({ variant: 'destructive', title: 'Could not load customer orders' }); })
      .finally(() => { if (mounted) setLoadingCO(false); });
    return () => { mounted = false; };
  }, [toast]);

  const handleCustomerStatusUpdate = async (id: string, status: CustomerOrderStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/customer-orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Update failed');
      const payload = (await res.json()) as { order: CustomerOrder };
      setCustomerOrders((c) => c.map((o) => (o.id === payload.order.id ? payload.order : o)));
      toast({ title: 'Order updated', description: `Status → ${status}` });
    } catch {
      toast({ variant: 'destructive', title: 'Update failed' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreatePurchaseOrder = async (orderInput: {
    supplierId: string;
    total: number;
    expectedDeliveryDate: string;
  }) => {
    const res = await fetch('/api/admin/purchase-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderInput),
    });

    if (!res.ok) {
      throw new Error('Create failed');
    }

    const payload = (await res.json()) as { order: PurchaseOrder };
    setPurchaseOrders((current) => [payload.order, ...current]);
  };

  const filteredCustomer = customerOrders.filter((o) =>
    !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPurchase = purchaseOrders.filter((o) =>
    !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.supplierName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex-1 space-y-6 p-4 md:p-8">

        {/* ── Header ── */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-headline text-4xl font-extrabold tracking-tight text-stitch-primary">Order Management</h2>
            <p className="mt-1 font-medium text-on-surface-variant">Verify prescriptions and dispatch healthcare essentials.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="rounded-xl border-none bg-surface-container-lowest py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-stitch-primary/20 w-56"
              />
            </div>
            <button
              onClick={() => setFormOpen(true)}
              className="btn-primary-gradient flex items-center gap-2 px-5 py-2.5 text-sm shadow-lg"
            >
              <PlusCircle className="h-4 w-4" /> New Order
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-2 rounded-xl bg-surface-container-lowest p-1 shadow-sm w-fit">
          <button
            onClick={() => setTab('customer')}
            className={`rounded-lg px-5 py-2 text-sm font-bold transition ${tab === 'customer' ? 'bg-stitch-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Customer Orders ({customerOrders.length})
          </button>
          <button
            onClick={() => setTab('purchase')}
            className={`rounded-lg px-5 py-2 text-sm font-bold transition ${tab === 'purchase' ? 'bg-stitch-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Purchase Orders ({purchaseOrders.length})
          </button>
        </div>

        {/* ── Customer orders ── */}
        {tab === 'customer' && (
          <div className="space-y-4">
            {loadingCO ? (
              <div className="rounded-2xl bg-surface-container-lowest p-12 text-center text-sm text-on-surface-variant shadow-sm">
                Loading customer orders…
              </div>
            ) : filteredCustomer.length === 0 ? (
              <div className="rounded-2xl bg-surface-container-lowest p-12 text-center shadow-sm">
                <p className="text-4xl mb-3">📦</p>
                <p className="font-bold text-on-surface">No customer orders yet</p>
              </div>
            ) : (
              filteredCustomer.map((order) => (
                <div
                  key={order.id}
                  className={`grid grid-cols-12 items-center rounded-2xl border-l-4 bg-surface-container-lowest p-5 shadow-sm ${borderColors[order.status] ?? 'border-l-outline'}`}
                >
                  <div className="col-span-12 mb-3 flex items-start justify-between sm:col-span-4 sm:mb-0">
                    <div>
                      <p className="font-bold text-on-surface">{order.customerName}</p>
                      <p className="text-xs text-outline">Order #{order.id} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                      <p className="mt-0.5 text-xs text-on-surface-variant truncate max-w-[200px]">{order.address}</p>
                    </div>
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusColors[order.status] ?? ''}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {order.status}
                    </span>
                  </div>
                  <div className="col-span-4 sm:col-span-3">
                    <p className="text-xs text-outline">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="font-bold text-stitch-primary">
                      {(order.total / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </p>
                  </div>
                  <div className="col-span-4 sm:col-span-3 flex flex-wrap justify-end gap-2">
                    {nextStatusOptions[order.status].map((s) => (
                      <button
                        key={s}
                        disabled={updatingId === order.id}
                        onClick={() => handleCustomerStatusUpdate(order.id, s)}
                        className="rounded-lg border border-stitch-primary/20 px-3 py-1.5 text-xs font-bold text-stitch-primary transition hover:bg-stitch-primary hover:text-white disabled:opacity-50"
                      >
                        → {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Purchase orders ── */}
        {tab === 'purchase' && (
          <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
            {loadingPO ? (
              <div className="p-12 text-center text-sm text-on-surface-variant">Loading purchase orders...</div>
            ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-surface-container bg-surface-container-low/50 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Supplier</th>
                  <th className="px-5 py-4">Order Date</th>
                  <th className="px-5 py-4">Expected</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredPurchase.map((o) => (
                  <tr key={o.id} className="transition hover:bg-surface-container-low/30">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-on-surface">{o.id}</td>
                    <td className="px-5 py-4 font-bold text-on-surface">{o.supplierName}</td>
                    <td className="px-5 py-4 text-on-surface-variant">{o.orderDate}</td>
                    <td className="px-5 py-4 text-on-surface-variant">{o.expectedDate}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusColors[o.status] ?? ''}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-stitch-primary">
                      {(o.total / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </td>
                  </tr>
                ))}
                {filteredPurchase.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-on-surface-variant">
                      No purchase orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            )}
          </div>
        )}
      </div>

      <OrderFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        onSave={handleCreatePurchaseOrder}
        suppliers={suppliers}
      />
    </>
  );
}
