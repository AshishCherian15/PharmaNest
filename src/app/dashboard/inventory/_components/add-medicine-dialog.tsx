'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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

interface MedicineFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (medicine: Medicine) => void;
  medicine?: Medicine;
}

export function MedicineFormDialog({ open, onOpenChange, onSave, medicine }: MedicineFormDialogProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const isEditing = !!medicine;

  useEffect(() => {
    if (isEditing && medicine) {
        setExpiryDate(new Date(medicine.expiryDate));
        const image = PlaceHolderImages.find(img => img.id === medicine.imageId);
        if (image) {
            setImagePreview(image.imageUrl);
        }
    } else {
        setExpiryDate(undefined);
        setImagePreview(null);
    }
  }, [medicine, isEditing]);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    
    const randomImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
    const savedMedicine: Medicine = {
      id: isEditing ? medicine.id : `MED${Date.now()}`, // Keep original id if editing
      name: data.name as string,
      genericName: data.genericName as string,
      description: data.description as string,
      category: data.category as string,
      price: parseFloat(data.price as string) * 100,
      quantity: parseInt(data.quantity as string, 10),
      expiryDate: format(expiryDate, 'yyyy-MM-dd'),
      imageId: medicine?.imageId || randomImage.id,
    };

    setTimeout(() => {
      onSave(savedMedicine);
      setIsSaving(false);
      onOpenChange(false);
      toast({
        title: isEditing ? 'Medicine Updated' : 'Medicine Added',
        description: `${data.name} has been successfully saved.`,
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Medicine' : 'Add New Medicine'}</DialogTitle>
          <DialogDescription>
            Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} id="medicine-form" onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" defaultValue={medicine?.name} placeholder="e.g., Paracetamol 500mg" required className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="genericName" className="text-right">Generic Name</Label>
              <Input id="genericName" name="genericName" defaultValue={medicine?.genericName} placeholder="e.g., Paracetamol" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">Description</Label>
              <Textarea id="description" name="description" defaultValue={medicine?.description} placeholder="e.g., For fever and pain relief." required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input id="category" name="category" defaultValue={medicine?.category} placeholder="e.g., Painkiller" required className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Image</Label>
                <div className="col-span-3 flex items-center gap-4">
                     <div className="relative">
                        <div className="w-20 h-20 border-dashed border-2 rounded-md flex items-center justify-center bg-muted/50">
                            {imagePreview ? (
                              <Image src={imagePreview} alt="Medicine preview" width={80} height={80} unoptimized className="w-full h-full object-cover rounded-md" />
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
              <Input id="price" name="price" type="number" step="0.01" defaultValue={medicine ? (medicine.price / 100).toFixed(2) : ''} placeholder="e.g., 50.25" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" defaultValue={medicine?.quantity} placeholder="e.g., 100" required className="col-span-3" />
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
