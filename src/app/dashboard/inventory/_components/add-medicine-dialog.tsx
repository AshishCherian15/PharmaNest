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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Camera, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Medicine } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface AddMedicineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMedicineAdded: (medicine: Medicine) => void;
}

export function AddMedicineDialog({ open, onOpenChange, onMedicineAdded }: AddMedicineDialogProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!expiryDate) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please select an expiry date.",
        });
        return;
    }

    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate creating a new medicine object
    const randomImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
    const newMedicine: Medicine = {
      id: `MED${Date.now()}`,
      name: data.name as string,
      description: data.description as string,
      category: data.category as string,
      price: parseFloat(data.price as string) * 100, // Store in cents
      quantity: parseInt(data.quantity as string, 10),
      expiryDate: format(expiryDate, 'yyyy-MM-dd'),
      imageId: randomImage.id,
    };

    console.log('New Medicine Data:', newMedicine);

    // Simulate API call
    setTimeout(() => {
      onMedicineAdded(newMedicine);
      setIsSaving(false);
      onOpenChange(false);
      toast({
        title: 'Medicine Added',
        description: `${data.name} has been successfully added to the inventory.`,
      });
    }, 1000);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      formRef.current?.reset();
      setExpiryDate(undefined);
      setImagePreview(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Medicine</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new medicine to the inventory.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} id="add-medicine-form" onSubmit={handleSave}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" placeholder="e.g., Paracetamol 500mg" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">Description</Label>
              <Textarea id="description" name="description" placeholder="e.g., For fever and pain relief." required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input id="category" name="category" placeholder="e.g., Painkiller" required className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Image</Label>
                <div className="col-span-3 flex items-center gap-4">
                     <div className="relative">
                        <div className="w-20 h-20 border-dashed border-2 rounded-md flex items-center justify-center bg-muted/50">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Medicine preview" className="w-full h-full object-cover rounded-md" />
                            ) : (
                                <span className="text-xs text-muted-foreground">Preview</span>
                            )}
                        </div>
                      <Label htmlFor="image-upload" className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90">
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Upload image</span>
                      </Label>
                      <Input id="image-upload" name="image" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </div>
                    <p className="text-xs text-muted-foreground">Upload a product image.</p>
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price (₹)</Label>
              <Input id="price" name="price" type="number" step="0.01" placeholder="e.g., 50.25" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" placeholder="e.g., 100" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiryDate" className="text-right">Expiry Date</Label>
               <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal col-span-3",
                            !expiryDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {expiryDate ? format(expiryDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={expiryDate}
                            onSelect={setExpiryDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                        />
                    </PopoverContent>
                </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSaving}>
                Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Medicine
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
