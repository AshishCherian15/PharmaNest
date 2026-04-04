'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type BackButtonProps = {
  fallbackHref?: string;
  className?: string;
  label?: string;
};

export function BackButton({ fallbackHref = '/', className, label }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        'flex items-center gap-1.5 rounded-full border border-outline-variant/40 bg-surface-container-lowest px-3 py-1.5 text-sm font-semibold text-on-surface-variant shadow-sm transition hover:border-stitch-primary/40 hover:bg-stitch-primary-fixed/10 hover:text-stitch-primary active:scale-95',
        className
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      {label ?? 'Back'}
    </button>
  );
}
