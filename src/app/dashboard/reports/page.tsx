'use client';

import { useMemo, useState } from 'react';
import {
  DollarSign,
  Package,
  ShoppingCart,
  AlertTriangle,
  CalendarDays,
  Download,
  Filter,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '../_components/stat-card';
import { mockSales, mockMedicines } from '@/lib/data';
import { SalesOverTimeChart } from './_components/sales-over-time-chart';
import { SalesByCategoryChart } from './_components/sales-by-category-chart';
import { PageHeader } from '@/components/dashboard/page-header';

const REPORT_PERIODS = ['Last 7 days', 'Last 30 days', 'Year to date'] as const;

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<(typeof REPORT_PERIODS)[number]>(
    'Last 30 days'
  );

  const totalRevenue = mockSales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalSales = mockSales.length;
  const lowStockMedicines = mockMedicines.filter(m => m.quantity > 0 && m.quantity < 10);
  const expiredMedicines = mockMedicines.filter(
    m => new Date(m.expiryDate) < new Date()
  );
  const lowStockItems = lowStockMedicines.length;
  const expiredItems = expiredMedicines.length;

  const topMedicines = useMemo(() => {
    const salesByCategory = mockMedicines.reduce<Record<string, number>>(
      (acc, medicine) => {
        acc[medicine.category] = (acc[medicine.category] || 0) + medicine.price;
        return acc;
      },
      {}
    );

    return Object.entries(salesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([category, value]) => {
        const representative = mockMedicines.find(m => m.category === category);
        return {
          category,
          medicineName: representative?.name || category,
          estimatedRevenue: value,
        };
      });
  }, []);

  const handleExportSummary = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Report Period', selectedPeriod],
      ['Total Revenue (INR)', (totalRevenue / 100).toFixed(2)],
      ['Total Sales', totalSales.toString()],
      ['Low Stock Items', lowStockItems.toString()],
      ['Expired Items', expiredItems.toString()],
    ];

    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pharma-nest-report-summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Reports & Analytics"
        description="Insights into your pharmacy performance."
        action={
          <Button variant="outline" onClick={handleExportSummary}>
            <Download className="mr-2 h-4 w-4" />
            Export Summary
          </Button>
        }
      />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 rounded-md border p-3">
          <div className="mr-2 flex items-center text-sm text-muted-foreground">
            <Filter className="mr-2 h-4 w-4" />
            Report Period
          </div>
          {REPORT_PERIODS.map(period => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {period}
            </Button>
          ))}
        </div>
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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Operational Watchlist</h3>
              <Badge variant="secondary">Live Snapshot</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                <span>Low stock medicines</span>
                <Badge variant="destructive">{lowStockItems}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                <span>Expired medicines</span>
                <Badge variant="destructive">{expiredItems}</Badge>
              </div>
              {lowStockMedicines.slice(0, 3).map(medicine => (
                <div key={medicine.id} className="flex items-center justify-between p-1">
                  <span className="text-muted-foreground">{medicine.name}</span>
                  <span className="text-xs">Qty {medicine.quantity}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Top Revenue Drivers</h3>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2 text-sm">
              {topMedicines.map(item => (
                <div
                  key={item.category}
                  className="flex items-center justify-between rounded-md bg-muted/40 p-2"
                >
                  <div>
                    <p className="font-medium">{item.medicineName}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <p className="font-semibold">
                    {(item.estimatedRevenue / 100).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
