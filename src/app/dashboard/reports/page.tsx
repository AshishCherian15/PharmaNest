'use client';

import * as React from 'react';
import { useState } from 'react';
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
import { SalesOverTimeChart } from './_components/sales-over-time-chart';
import { SalesByCategoryChart } from './_components/sales-by-category-chart';
import { PageHeader } from '@/components/dashboard/page-header';
import { useToast } from '@/hooks/use-toast';

type LowStockMedicine = {
  id: string;
  name: string;
  quantity: number;
};

type TopMedicine = {
  medicineId: string;
  medicineName: string;
  estimatedRevenue: number;
};

type ReportSummary = {
  totalRevenue: number;
  totalSales: number;
  lowStockItems: number;
  expiredItems: number;
  lowStockMedicines: LowStockMedicine[];
  topMedicines: TopMedicine[];
};

const REPORT_PERIODS = ['Last 7 days', 'Last 30 days', 'Year to date'] as const;

export default function ReportsPage() {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState<(typeof REPORT_PERIODS)[number]>(
    'Last 30 days'
  );
  const [summary, setSummary] = React.useState<ReportSummary | null>(null);

  const loadSummary = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/reports/summary', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load reports');
      const data = (await res.json()) as { summary?: ReportSummary };
      setSummary(data.summary ?? null);
    } catch {
      toast({ variant: 'destructive', title: 'Load failed', description: 'Unable to load report summary.' });
    }
  }, [toast]);

  React.useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  const totalRevenue = summary?.totalRevenue ?? 0;
  const totalSales = summary?.totalSales ?? 0;
  const lowStockItems = summary?.lowStockItems ?? 0;
  const expiredItems = summary?.expiredItems ?? 0;
  const lowStockMedicines = summary?.lowStockMedicines ?? [];
  const topMedicines = summary?.topMedicines ?? [];

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
                  key={item.medicineId}
                  className="flex items-center justify-between rounded-md bg-muted/40 p-2"
                >
                  <div>
                    <p className="font-medium">{item.medicineName}</p>
                    <p className="text-xs text-muted-foreground">{item.medicineId}</p>
                  </div>
                  <p className="font-semibold">
                    {(item.estimatedRevenue / 100).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })}
                  </p>
                </div>
              ))}
              {topMedicines.length === 0 && (
                <p className="text-xs text-muted-foreground">No sales data available yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
