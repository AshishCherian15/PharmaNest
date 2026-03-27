'use client';

import {
  DollarSign,
  Package,
  ShoppingCart,
  AlertTriangle,
} from 'lucide-react';
import { StatCard } from '../_components/stat-card';
import { mockSales, mockMedicines } from '@/lib/data';
import { SalesOverTimeChart } from './_components/sales-over-time-chart';
import { SalesByCategoryChart } from './_components/sales-by-category-chart';

export default function ReportsPage() {
    const totalRevenue = mockSales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalSales = mockSales.length;
    const lowStockItems = mockMedicines.filter(m => m.quantity > 0 && m.quantity < 10).length;
    const expiredItems = mockMedicines.filter(m => new Date(m.expiryDate) < new Date()).length;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={(totalRevenue / 100).toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
            })}
            description="Total revenue from all sales"
            icon={DollarSign}
          />
          <StatCard
            title="Total Sales"
            value={totalSales.toLocaleString()}
            description="Total number of transactions"
            icon={ShoppingCart}
          />
           <StatCard
            title="Low Stock Items"
            value={lowStockItems.toLocaleString()}
            description="Items with quantity less than 10"
            icon={Package}
            variant="destructive"
          />
          <StatCard
            title="Expired Items"
            value={expiredItems.toLocaleString()}
            description="Items past their expiry date"
            icon={AlertTriangle}
            variant="destructive"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SalesOverTimeChart />
            <SalesByCategoryChart />
        </div>
      </div>
    </div>
  );
}
