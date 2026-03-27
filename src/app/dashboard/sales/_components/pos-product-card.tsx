'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Medicine } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PosProductCardProps {
  medicine: Medicine;
  onAddToCart: (medicine: Medicine) => void;
}

export function PosProductCard({ medicine, onAddToCart }: PosProductCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === medicine.imageId);
  const isOutOfStock = medicine.quantity === 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-4">
        <div className="aspect-square relative">
          <Image
            src={image?.imageUrl || 'https://placehold.co/150x150'}
            alt={medicine.name}
            fill
            className="rounded-md object-cover"
            data-ai-hint={image?.imageHint}
          />
           {isOutOfStock && <Badge variant="destructive" className="absolute top-2 right-2">Out of Stock</Badge>}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <CardTitle className="text-base font-medium leading-tight mb-1">{medicine.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{`Stock: ${medicine.quantity}`}</p>
        <p className="text-lg font-semibold mt-2">
            {(medicine.price / 100).toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
            })}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
            className="w-full"
            onClick={() => onAddToCart(medicine)}
            disabled={isOutOfStock}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
