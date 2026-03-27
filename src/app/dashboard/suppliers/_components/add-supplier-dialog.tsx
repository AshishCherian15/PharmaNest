'use client';

import React, { useEffect, useState } from 'react';
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

interface SupplierFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (supplier: Supplier) => void;
  supplier?: Supplier;
}

export function SupplierFormDialog({ open, onOpenChange, onSave, supplier }: SupplierFormDialogProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!supplier;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const savedSupplier: Supplier = {
        id: isEditing ? supplier.id : `SUP${Date.now()}`,
        name: data.name as string,
        contactPerson: data.contactPerson as string,
        email: data.email as string,
        phone: data.phone as string,
    };
    
    console.log('Saved Supplier Data:', savedSupplier);

    setTimeout(() => {
      onSave(savedSupplier);
      setIsSaving(false);
      onOpenChange(false);
      toast({
        title: isEditing ? 'Supplier Updated' : 'Supplier Added',
        description: `${data.name} has been successfully saved.`,
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
          <DialogDescription>
            Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form id="supplier-form" onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" defaultValue={supplier?.name} placeholder="e.g., Global Pharma Inc." required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactPerson" className="text-right">Contact Person</Label>
              <Input id="contactPerson" name="contactPerson" defaultValue={supplier?.contactPerson} placeholder="e.g., John Doe" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={supplier?.email} placeholder="e.g., contact@globalpharma.com" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Phone</Label>
              <Input id="phone" name="phone" defaultValue={supplier?.phone} placeholder="e.g., +1-202-555-0173" required className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                Cancel
            </Button>
            <Button type="submit" form="supplier-form" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
