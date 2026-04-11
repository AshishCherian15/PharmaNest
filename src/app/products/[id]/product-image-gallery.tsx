'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { getPlaceholderBlurDataURL, getPlaceholderImageById } from '@/lib/placeholder-images';
import { getProductImageTheme } from '@/lib/product-image-theme';
import { cn } from '@/lib/utils';

type ProductImageGalleryProps = {
  imageId: string;
  productName: string;
  category: string;
  additionalImageIds?: string[];
};

function buildVariantUrl(productName: string, label: string, category: string) {
  const theme = getProductImageTheme(category);
  return `https://placehold.co/1200x900/${theme.placeholderBgHex}/${theme.placeholderTextHex}?text=${encodeURIComponent(`${productName} ${label}`)}`;
}

export function ProductImageGallery({ imageId, productName, category, additionalImageIds = [] }: ProductImageGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [mainFailed, setMainFailed] = useState(false);
  const [mainLoaded, setMainLoaded] = useState(false);
  const blurDataURL = getPlaceholderBlurDataURL(category);
  const theme = getProductImageTheme(category);

  const gallery = useMemo(() => {
    const primary = getPlaceholderImageById(imageId)?.imageUrl;
    const additionalUrls = additionalImageIds
      .map((id) => getPlaceholderImageById(id)?.imageUrl)
      .filter((v): v is string => !!v);

    const items = [primary, ...additionalUrls].filter((v): v is string => !!v);

    while (items.length < 4) {
      const label = items.length === 1 ? 'Front View' : items.length === 2 ? 'Pack Shot' : 'Label Info';
      items.push(buildVariantUrl(productName, label, category));
    }

    return Array.from(new Set(items));
  }, [additionalImageIds, category, imageId, productName]);

  const currentUrl = gallery[selected] ?? gallery[0] ?? null;

  return (
    <>
      <div className="relative mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-surface-container-lowest p-8 shadow-sm group perspective-card">
        {currentUrl && !mainFailed ? (
          <Image
            src={currentUrl}
            alt={productName}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            placeholder="blur"
            blurDataURL={blurDataURL}
            className={cn(
              'object-contain transition-all duration-500 group-hover:scale-105',
              mainLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onError={() => setMainFailed(true)}
            onLoad={() => setMainLoaded(true)}
            priority
          />
        ) : (
          <div className={cn('relative flex h-full w-full items-center justify-center bg-gradient-to-br', theme.fallbackGradientClass)}>
            <div className="absolute inset-0 dot-pattern opacity-20" />
            <div className="relative flex flex-col items-center gap-2 text-center">
              <span className="text-7xl">{theme.glyph}</span>
              <span className="max-w-[220px] text-xs font-bold leading-tight text-stitch-primary">{productName}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {gallery.slice(0, 4).map((url, idx) => (
          <button
            key={`${url}-${idx}`}
            type="button"
            onClick={() => {
              setSelected(idx);
              setMainFailed(false);
              setMainLoaded(false);
            }}
            className={cn(
              'relative overflow-hidden rounded-xl p-1.5 transition',
              idx === selected
                ? 'border-2 border-stitch-primary bg-surface-container-lowest'
                : 'bg-surface-container-low hover:bg-surface-container-high'
            )}
            aria-label={`Product image ${idx + 1}`}
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-container">
              <Image
                src={url}
                alt={`${productName} preview ${idx + 1}`}
                fill
                sizes="96px"
                placeholder="blur"
                blurDataURL={blurDataURL}
                className="object-cover"
              />
              <span className="absolute bottom-1 left-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {idx + 1}
              </span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
