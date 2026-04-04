'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { weeklySalesData } from '@/lib/data';

export function SalesChart() {
  return (
    <Card className="lg:col-span-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Weekly Sales</CardTitle>
            <CardDescription className="mt-1">Revenue overview for this week.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklySalesData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--accent))', radius: 6 }}
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: 13,
              }}
              formatter={(value: number) => [`₹${(value/100).toLocaleString('en-IN')}`, 'Sales']}
            />
            <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
