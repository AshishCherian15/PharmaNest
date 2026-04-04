'use client';

import * as React from 'react';
import { useMemo, useState } from 'react';
import { mockMedicines, mockSales } from '@/lib/data';
import type { Medicine, Sale } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { PosProductCard } from './_components/pos-product-card';
import { SaleSummary } from './_components/sale-summary';
import { CartItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '../_components/stat-card';
import { Download, TrendingUp, ShoppingCart, Clock } from 'lucide-react';

export default function SalesPage() {
  const { toast } = useToast();
  const [medicines, setMedicines] = React.useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [salesHistory, setSalesHistory] = React.useState<Array<{ id: string; amount: number; items: number; timestamp: string }>>([]);

  React.useEffect(() => {
    // In a real app, you'd fetch this from an API
    setMedicines(mockMedicines);
  }, []);

  const salesMetrics = useMemo(() => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    return {
      totalTransactions: salesHistory.length,
      totalRevenue: salesHistory.reduce((sum, sale) => sum + sale.amount, 0),
      averageTransaction: salesHistory.length > 0 
        ? Math.round(salesHistory.reduce((sum, sale) => sum + sale.amount, 0) / salesHistory.length)
        : 0,
    };
  }, [salesHistory]);

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (medicine: Medicine) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.medicineId === medicine.id
      );
      if (existingItem) {
        if (existingItem.quantity < medicine.quantity) {
          return prevCart.map((item) =>
            item.medicineId === medicine.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          toast({
            variant: 'destructive',
            title: 'Stock limit reached',
            description: `No more ${medicine.name} in stock.`,
          });
          return prevCart;
        }
      }
      return [
        ...prevCart,
        {
          medicineId: medicine.id,
          name: medicine.name,
          price: medicine.price,
          quantity: 1,
          stock: medicine.quantity,
        },
      ];
    });
  };

  const handleUpdateQuantity = (medicineId: string, newQuantity: number) => {
    const medicineInStock = medicines.find(med => med.id === medicineId);
    if (!medicineInStock) return;

    if (newQuantity <= 0) {
        // If quantity is 0 or less, remove the item
        setCart((prevCart) => prevCart.filter((item) => item.medicineId !== medicineId));
    } else if (newQuantity > medicineInStock.quantity) {
        // If new quantity exceeds stock, show an error
        toast({
            variant: 'destructive',
            title: 'Stock limit reached',
            description: `Only ${medicineInStock.quantity} units of ${medicineInStock.name} are in stock.`,
        });
        // Optionally, set cart quantity to max available stock
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.medicineId === medicineId ? { ...item, quantity: medicineInStock.quantity } : item
            )
        );
    } else {
        // Otherwise, update the quantity
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.medicineId === medicineId ? { ...item, quantity: newQuantity } : item
            )
        );
    }
  };

  const handleRemoveItem = (medicineId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.medicineId !== medicineId)
    );
  };
  
  const handleCancelSale = () => {
    setCart([]);
    toast({
        title: "Sale Cancelled",
        description: "The current sale has been cleared.",
    });
  }

  const handleCompleteSale = () => {
    if (cart.length === 0) {
        toast({
            variant: "destructive",
            title: "Cannot Complete Sale",
            description: "The cart is empty.",
        });
        return;
    }
    const saleAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newSale = {
      id: `TXN${Date.now()}`,
      amount: saleAmount,
      items: cart.length,
      timestamp: new Date().toISOString(),
    };
    setSalesHistory(prev => [newSale, ...prev]);
    setCart([]);
    toast({
        title: "Sale Completed",
        description: `Transaction ${newSale.id}: ${(saleAmount / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`,
    });
  }

  const handleExportSalesReport = () => {
    const rows = [
      ['Transaction ID', 'Amount (INR)', 'Items', 'Timestamp'],
      ...salesHistory.map(sale => [
        sale.id,
        (sale.amount / 100).toFixed(2),
        sale.items.toString(),
        new Date(sale.timestamp).toLocaleString('en-IN'),
      ]),
    ];
    const csv = rows.map(row => row.map(value => `"${value}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pharma-nest-sales-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Point of Sale</h2>
          <p className="text-sm text-muted-foreground">Real-time sales transactions and inventory management</p>
        </div>
        <Button variant="outline" onClick={handleExportSalesReport} disabled={salesHistory.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Sales Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Revenue"
          value={(salesMetrics.totalRevenue / 100).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
          })}
          description="Total sales amount"
          icon={TrendingUp}
        />
        <StatCard
          title="Transactions"
          value={salesMetrics.totalTransactions.toString()}
          description="Completed sales today"
          icon={ShoppingCart}
        />
        <StatCard
          title="Average Sale"
          value={(salesMetrics.averageTransaction / 100).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
          })}
          description="Per transaction average"
          icon={TrendingUp}
        />
        <StatCard
          title="Items Sold"
          value={salesHistory.reduce((sum, s) => sum + s.items, 0).toString()}
          description="Total product count"
          icon={ShoppingCart}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full flex flex-col min-h-[600px]">
            <Input
              placeholder="Search for medicines or products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-full mb-4"
            />
            <ScrollArea className="flex-1 pr-4 -mr-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMedicines.map((medicine) => (
                    <PosProductCard
                    key={medicine.id}
                    medicine={medicine}
                    onAddToCart={() => handleAddToCart(medicine)}
                    />
                ))}
                </div>
            </ScrollArea>
        </div>
        <div className="lg:col-span-1 space-y-4">
            <SaleSummary
                cartItems={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCancelSale={handleCancelSale}
                onCompleteSale={handleCompleteSale}
            />
            
            {/* Transaction History */}
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Today's Transactions
                </h3>
                <Badge variant="secondary">{salesHistory.length}</Badge>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {salesHistory.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No transactions yet
                  </p>
                ) : (
                  salesHistory.slice(0, 10).map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between rounded-md bg-muted/50 p-2 text-xs">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{transaction.id}</span>
                        <span className="text-muted-foreground">{transaction.items} items</span>
                      </div>
                      <div className="text-right font-semibold">
                        ₹{(transaction.amount / 100).toFixed(0)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
