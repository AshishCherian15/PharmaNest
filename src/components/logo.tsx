import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  href?: string;
  className?: string;
  imageSize?: number;
  /** If true, always show text even on small screens */
  alwaysShowText?: boolean;
  /** dark = white/mint text for dark backgrounds */
  variant?: 'light' | 'dark';
}

export function Logo({
  href = '/',
  className,
  imageSize = 40,
  alwaysShowText = false,
  variant = 'light',
}: LogoProps) {
  const primaryText = variant === 'dark' ? '#a6eac8' : '#0d4f32';
  const accentText  = variant === 'dark' ? '#ffffff' : '#2daa6e';

  return (
    <Link href={href} className={cn('flex items-center gap-2.5', className)}>
      <Image
        src="/PharmaNest.png"
        alt="Pharma Nest"
        width={imageSize}
        height={imageSize}
        className="shrink-0 rounded-xl object-contain"
        priority
      />
      <span
        className={cn(
          'font-extrabold leading-none tracking-tight',
          alwaysShowText ? 'block' : 'hidden md:block'
        )}
        style={{ fontSize: 26, color: primaryText }}
      >
        Pharma<span style={{ color: accentText }}>Nest</span>
      </span>
    </Link>
  );
}
