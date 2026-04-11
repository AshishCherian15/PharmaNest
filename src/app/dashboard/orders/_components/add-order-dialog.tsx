'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import type { Supplier } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (order: {
    supplierId: string;
    total: number;
    expectedDeliveryDate: string;
  }) => Promise<void>;
  suppliers: Supplier[];
}

export function OrderFormDialog({ open, onOpenChange, onSave, suppliers }: OrderFormDialogProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [expectedDate, setExpectedDate] = useState<Date | undefined>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!expectedDate) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please select an expected delivery date.",
        });
        return;
    }

    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const supplier = suppliers.find(s => s.id === data.supplierId);
    if (!supplier) {
        // This should not happen if the form is correctly set up
        toast({ variant: "destructive", title: "Supplier not found" });
        setIsSaving(false);
        return;
    }

    try {
      await onSave({
        supplierId: String(data.supplierId),
        expectedDeliveryDate: format(expectedDate, 'yyyy-MM-dd'),
        total: Math.round(parseFloat(String(data.total)) * 100),
      });
      setIsSaving(false);
      onOpenChange(false);
      toast({
        title: 'Order Created',
        description: `A new purchase order for ${supplier.name} has been created.`,
      });
    } catch {
      setIsSaving(false);
      toast({
        variant: 'destructive',
        title: 'Create failed',
        description: 'Unable to create purchase order.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Purchase Order</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new order.
          </DialogDescription>
        </DialogHeader>
        <form id="order-form" onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierId" className="text-right">Supplier</Label>
                <Select name="supplierId" required>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                        {suppliers.map(supplier => (
                             <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expectedDate" className="text-right">Expected Date</Label>
                <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal col-span-3",
                                !expectedDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {expectedDate ? format(expectedDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={expectedDate}
                                onSelect={setExpectedDate}
                                initialFocus
                                disabled={(date) => date < new Date()}
                            />
                        </PopoverContent>
                    </Popover>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total" className="text-right">Total Amount (₹)</Label>
              <Input id="total" name="total" type="number" step="0.01" placeholder="e.g., 15000.50" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right pt-2">Notes/Items</Label>
              <Textarea id="notes" name="notes" placeholder="e.g., 100 units of Paracetamol, 50 units of Amoxicillin" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                Cancel
            </Button>
            <Button type="submit" form="order-form" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
