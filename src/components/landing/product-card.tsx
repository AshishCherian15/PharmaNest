'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Medicine } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Medicine;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === product.imageId);

  const renderStars = () => {
    const stars = [];
    const rating = product.rating || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted stroke-muted-foreground'
          )}
        />
      );
    }
    return stars;
  };

  return (
    <div className={cn('group relative', className)}>
      <div className="overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
        <Link href="#" className="block">
          <div className="aspect-square w-full">
            {image && (
              <Image
                src={image.imageUrl}
                alt={product.name}
                width={250}
                height={250}
                className="h-full w-full object-cover"
                data-ai-hint={image.imageHint}
              />
            )}
             {product.previousPrice && (
              <div className="absolute top-2 left-2 rounded-full bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground">
                Sale
              </div>
            )}
          </div>
        </Link>
        <div className="p-4">
          <h3 className="mb-1 h-10 overflow-hidden text-sm font-medium">
            <Link href="#" className="hover:underline">
              {product.name}
            </Link>
          </h3>
          <p className="mb-2 text-xs text-muted-foreground">{product.category}</p>
          <div className="mb-3 flex items-center gap-1">{renderStars()}
            <span className="text-xs text-muted-foreground">({product.reviews || 0})</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className='flex items-baseline gap-2'>
              <p className="text-lg font-bold">
                {(product.price / 100).toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                })}
              </p>
              {product.previousPrice && (
                  <p className="text-sm text-muted-foreground line-through">
                  {(product.previousPrice / 100).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                  })}
                  </p>
              )}
            </div>
            <Button size="icon" variant="outline" className="h-8 w-8">
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only">Add to Cart</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
