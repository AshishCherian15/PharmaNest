'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/lib/types';
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SaleSummaryProps {
  cartItems: CartItem[];
  onUpdateQuantity: (medicineId: string, newQuantity: number) => void;
  onRemoveItem: (medicineId: string) => void;
  onCancelSale: () => void;
  onCompleteSale: () => void;
}

export function SaleSummary({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCancelSale,
  onCompleteSale
}: SaleSummaryProps) {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxRate = 0.05; // 5% tax, for example
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
            <ShoppingCart className="mr-2" />
            Current Sale
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col">
        {cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Your cart is empty.
          </div>
        ) : (
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.medicineId} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(item.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onUpdateQuantity(item.medicineId, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onUpdateQuantity(item.medicineId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                   <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => onRemoveItem(item.medicineId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      {cartItems.length > 0 && (
          <div className="mt-auto p-6 pt-2">
             <Separator className="my-4" />
             <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{(subtotal / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>{(tax / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{(total / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                </div>
             </div>
          </div>
      )}
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="w-full" onClick={onCancelSale}>
          <X className="mr-2 h-4 w-4"/>
          Cancel
        </Button>
        <Button className="w-full" onClick={onCompleteSale}>
            Complete Sale
        </Button>
      </CardFooter>
    </Card>
  );
}
