import Link from 'next/link';
import { getAllCustomerOrdersDb } from '@/lib/customer-orders-db';
import { getAllProducts } from '@/lib/product-store';
import { getAllPrescriptions } from '@/lib/prescriptions';
import { getPurchaseOrders } from '@/lib/purchase-orders';
import { getSuppliers } from '@/lib/suppliers';
import { getSalesTransactions } from '@/lib/sales';
import { getExpiringMedicines, getLowStockMedicines } from '@/lib/medicines';
import { SalesChart } from './_components/sales-chart';
import { AlertsCard } from './_components/alerts-card';
import { TodaysTopSales } from './_components/recent-sales';
import { LatestMedicines } from './_components/latest-medicines';

export default async function DashboardPage() {
  const [products, prescriptions, purchaseOrders, customerOrders, suppliers, salesTransactions, expiringMedicines, lowStockMedicines] = await Promise.all([
    getAllProducts(),
    getAllPrescriptions(),
    getPurchaseOrders(),
    getAllCustomerOrdersDb(),
    getSuppliers(),
    getSalesTransactions(),
    getExpiringMedicines(60),
    getLowStockMedicines(10),
  ]);

  const totalMedicines = products.length;
  const totalSales = salesTransactions.reduce((sum, sale) => sum + sale.amount, 0);
  const expiringSoon = expiringMedicines.length;
  const pendingOrders = purchaseOrders.filter((order) => order.status === 'Pending' || order.status === 'Shipped').length
    + customerOrders.filter((order) => order.status === 'Placed' || order.status === 'Processing' || order.status === 'Shipped').length;
  const pendingRx = prescriptions.filter((prescription) => prescription.status === 'pending').length;
  const stockEfficiency = totalMedicines > 0
    ? Math.round(((totalMedicines - lowStockMedicines.length) / totalMedicines) * 100)
    : 0;

  const kpis = [
    {
      label: 'Total Revenue',
      value: `₹${(totalSales / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      trend: '+12.4%',
      trendUp: true,
      icon: '💰',
      border: 'border-b-4 border-emerald-500',
      href: '/dashboard/reports',
    },
    {
      label: 'Stock Efficiency',
      value: `${stockEfficiency}%`,
      trend: `${totalMedicines} items`,
      trendUp: true,
      icon: '💊',
      border: 'border-b-4 border-stitch-secondary',
      href: '/dashboard/inventory',
    },
    {
      label: 'Pending Orders',
      value: `${pendingOrders} Active`,
      trend: '-2.1%',
      trendUp: false,
      icon: '🛒',
      border: 'border-b-4 border-stitch-primary',
      href: '/dashboard/orders',
    },
    {
      label: 'Pending Rx',
      value: pendingRx.toString(),
      trend: 'Awaiting review',
      trendUp: false,
      icon: '📋',
      border: 'border-b-4 border-amber-500',
      href: '/dashboard/prescriptions',
    },
    {
      label: 'Expiring Soon',
      value: expiringSoon.toString(),
      trend: 'Within 60 days',
      trendUp: false,
      icon: '⚠️',
      border: 'border-b-4 border-red-500',
      href: '/dashboard/inventory',
    },
    {
      label: 'Suppliers',
      value: suppliers.length.toString(),
      trend: 'Active partners',
      trendUp: true,
      icon: '🚚',
      border: 'border-b-4 border-stitch-tertiary',
      href: '/dashboard/suppliers',
    },
  ];

  return (
    <div className="flex-1">
      {/* ── Greeting banner ── */}
      <div className="mg-gradient-teal px-6 py-6 sm:px-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-stitch-secondary-fixed/70">Operational Overview</span>
            <h2 className="font-headline mt-1 text-3xl font-extrabold tracking-tight text-white">Pharmacy Insights</h2>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white/80">
              📅 {new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-4 sm:p-6 md:p-8">

        {/* ── KPI grid — stitch style with colored bottom borders ── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {kpis.map((kpi) => (
            <Link
              key={kpi.label}
              href={kpi.href}
              className={`rounded-xl bg-surface-container-lowest p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${kpi.border}`}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-lg">
                  {kpi.icon}
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-bold ${kpi.trendUp ? 'text-green-600' : 'text-red-500'}`}>
                  {kpi.trendUp ? '↑' : '↓'} {kpi.trend}
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-outline">{kpi.label}</p>
              <p className="font-headline mt-1 text-xl font-extrabold text-on-surface">{kpi.value}</p>
            </Link>
          ))}
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
          <SalesChart />
          <TodaysTopSales />
        </div>

        {/* ── Alerts + Latest medicines ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AlertsCard />
          <LatestMedicines />
        </div>

        {/* ── Top suppliers table — stitch style ── */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-stitch-primary/5 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-headline text-lg font-bold text-stitch-primary">Top Suppliers</h3>
              <Link href="/dashboard/suppliers" className="text-xs font-bold text-stitch-secondary hover:underline">
                Manage All →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/10 text-[10px] font-black uppercase tracking-widest text-outline">
                    <th className="pb-3">Supplier Name</th>
                    <th className="pb-3">Contact</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3 text-right">Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {suppliers.slice(0, 4).map((s) => (
                    <tr key={s.id} className="transition hover:bg-surface-container-low">
                      <td className="py-3 font-bold text-on-surface">{s.name}</td>
                      <td className="py-3 text-on-surface-variant">{s.contactPerson}</td>
                      <td className="py-3 text-on-surface-variant">{s.email}</td>
                      <td className="py-3 text-right font-medium text-on-surface-variant">{s.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
