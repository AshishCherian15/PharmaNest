import { StatCard } from './_components/stat-card';
import { SalesChart } from './_components/sales-chart';
import { TodaysTopSales } from './_components/recent-sales';
import {
  Package,
  Truck,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { mockMedicines } from '@/lib/data';
import { AlertsCard } from './_components/alerts-card';
import { LatestMedicines } from './_components/latest-medicines';

export default function DashboardPage() {
  const totalMedicines = 1250;
  const totalSuppliers = 28;
  const totalSales = 3754246.87;
  const expiringSoon = mockMedicines.filter(
    (m) => new Date(m.expiryDate) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Medicines"
            value={totalMedicines.toLocaleString()}
            description="Across all categories"
            icon={Package}
          />
          <StatCard
            title="Total Suppliers"
            value={totalSuppliers.toLocaleString()}
            description="Active partnerships"
            icon={Truck}
          />
          <StatCard
            title="Total Sales (Month)"
            value={`₹${totalSales.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            description="+20.1% from last month"
            icon={DollarSign}
          />
          <StatCard
            title="Expiring Soon"
            value={expiringSoon.toLocaleString()}
            description="Medicines expiring in 60 days"
            icon={AlertTriangle}
            variant="destructive"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <SalesChart />
            <TodaysTopSales />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AlertsCard />
          <LatestMedicines />
        </div>
      </div>
    </div>
  );
}
