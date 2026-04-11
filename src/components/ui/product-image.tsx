'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { getPlaceholderBlurDataURL, getPlaceholderImageById } from '@/lib/placeholder-images';
import { getProductImageTheme } from '@/lib/product-image-theme';
import { cn } from '@/lib/utils';

type ProductImageProps = {
  imageId?: string;
  name: string;
  category?: string;
  imageHint?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fit?: 'cover' | 'contain';
  showNameInFallback?: boolean;
  enableBlur?: boolean;
};

export function ProductImage({
  imageId,
  name,
  category,
  imageHint,
  className,
  sizes = '(max-width: 768px) 100vw, 33vw',
  priority = false,
  fit = 'cover',
  showNameInFallback = true,
  enableBlur = true,
}: ProductImageProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const image = useMemo(
    () => getPlaceholderImageById(imageId),
    [imageId]
  );

  const canRenderImage = !!image?.imageUrl && !imageFailed;
  const theme = getProductImageTheme(category);
  const blurDataURL = getPlaceholderBlurDataURL(category);

  useEffect(() => {
    setImageFailed(false);
    setImageLoaded(false);
  }, [image?.imageUrl]);

  if (canRenderImage) {
    return (
      <Image
        src={image.imageUrl}
        alt={name}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={enableBlur ? 'blur' : 'empty'}
        blurDataURL={enableBlur ? blurDataURL : undefined}
        className={cn(
          'transition-all duration-500',
          imageLoaded ? 'opacity-100' : 'opacity-0',
          fit === 'contain' ? 'object-contain' : 'object-cover',
          className
        )}
        data-ai-hint={imageHint ?? image.imageHint}
        onError={() => setImageFailed(true)}
        onLoad={() => setImageLoaded(true)}
      />
    );
  }

  return (
    <div className={cn('relative flex h-full w-full items-center justify-center bg-gradient-to-br', theme.fallbackGradientClass)}>
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="relative flex flex-col items-center gap-2 px-2 text-center">
        <span className="text-4xl">{theme.glyph}</span>
        {showNameInFallback && (
          <span className="max-w-[180px] text-[11px] font-bold leading-tight text-stitch-primary">{name}</span>
        )}
      </div>
    </div>
  );
}
