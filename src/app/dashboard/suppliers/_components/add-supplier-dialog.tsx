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
import { Loader2 } from 'lucide-react';
import type { Supplier } from '@/lib/types';

interface AddSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSupplierAdded: (supplier: Supplier) => void;
}

export function AddSupplierDialog({ open, onOpenChange, onSupplierAdded }: AddSupplierDialogProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const newSupplier: Supplier = {
        id: `SUP${Date.now()}`,
        name: data.name as string,
        contactPerson: data.contactPerson as string,
        email: data.email as string,
        phone: data.phone as string,
    };
    
    console.log('New Supplier Data:', newSupplier);

    // Simulate API call
    setTimeout(() => {
      onSupplierAdded(newSupplier);
      setIsSaving(false);
      onOpenChange(false);
      toast({
        title: 'Supplier Added',
        description: `${data.name} has been successfully added.`,
      });
    }, 1000);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      formRef.current?.reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new supplier.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} id="add-supplier-form" onSubmit={handleSave}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" placeholder="e.g., Global Pharma Inc." required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactPerson" className="text-right">Contact Person</Label>
              <Input id="contactPerson" name="contactPerson" placeholder="e.g., John Doe" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" name="email" type="email" placeholder="e.g., contact@globalpharma.com" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Phone</Label>
              <Input id="phone" name="phone" placeholder="e.g., +1-202-555-0173" required className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSaving}>
                Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Supplier
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
