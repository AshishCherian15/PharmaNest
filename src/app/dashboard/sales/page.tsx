'use client';

import * as React from 'react';
import { mockMedicines } from '@/lib/data';
import type { Medicine } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { PosProductCard } from './_components/pos-product-card';
import { SaleSummary } from './_components/sale-summary';
import { CartItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SalesPage() {
  const { toast } = useToast();
  const [medicines, setMedicines] = React.useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [cart, setCart] = React.useState<CartItem[]>([]);

  React.useEffect(() => {
    // In a real app, you'd fetch this from an API
    setMedicines(mockMedicines);
  }, []);

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
    // Here you would typically process the payment and update inventory
    console.log("Completing sale with items:", cart);
    setCart([]);
    toast({
        title: "Sale Completed",
        description: "The transaction was successful.",
    });
  }


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 h-[calc(100vh-theme(spacing.14))]">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Point of Sale</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-60px)]">
        <div className="lg:col-span-2 h-full flex flex-col">
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
        <div className="lg:col-span-1 h-full">
            <SaleSummary
                cartItems={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCancelSale={handleCancelSale}
                onCompleteSale={handleCompleteSale}
            />
        </div>
      </div>
    </div>
  );
}
