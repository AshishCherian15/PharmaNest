import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  href?: string;
  className?: string;
  imageSize?: number;
  /** If true, always show text even on small screens */
  alwaysShowText?: boolean;
  /** If true, hide text and render image-only logo */
  hideText?: boolean;
  /** dark = white/mint text for dark backgrounds */
  variant?: 'light' | 'dark';
}

export function Logo({
  href = '/',
  className,
  imageSize = 40,
  alwaysShowText = false,
  hideText = false,
  variant = 'light',
}: LogoProps) {
  const isDark = variant === 'dark';
  const textSizeClass = imageSize >= 56 ? 'text-3xl' : imageSize >= 48 ? 'text-2xl' : 'text-xl';

  return (
    <Link href={href} className={cn('group flex items-center gap-3 transition-all duration-200 hover:opacity-90', className)}>
      {/* Enhanced text logo with gradient and styling */}
      {!hideText && (
        <span
          className={cn(
            'font-header font-extrabold leading-tight tracking-tight transition-all duration-300',
            alwaysShowText ? 'block' : 'hidden sm:block',
            textSizeClass,
            'group-hover:scale-105 origin-left'
          )}
        >
          <span className={cn(
            'bg-clip-text',
            isDark
              ? 'bg-gradient-to-r from-stitch-primary-fixed via-stitch-secondary-fixed to-stitch-primary-fixed text-transparent'
              : 'bg-gradient-to-r from-stitch-primary via-stitch-primary-container to-stitch-secondary text-transparent'
          )}>
            Pharma
          </span>
          <span className={cn(
            'ml-0.5 font-bold transition-colors duration-300',
            isDark ? 'text-white' : 'text-stitch-secondary'
          )}>
            Nest
          </span>
        </span>
      )}
    </Link>
  );
}
