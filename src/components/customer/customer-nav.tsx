'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type CustomerNavItem = { href: string; label: string };

export function CustomerNav({ items }: { items: CustomerNavItem[] }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop nav */}
      <nav className="ml-auto hidden items-center gap-1 md:flex">
        {items.map((item) => {
          const active = item.href === '/customer'
            ? pathname === '/customer'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${
                active
                  ? 'bg-stitch-primary-fixed/30 text-stitch-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile horizontal scroll nav */}
      <div className="border-t border-outline-variant/10 md:hidden">
        <div className="flex overflow-x-auto scrollbar-hide px-4 py-2 gap-2">
          {items.map((item) => {
            const active = item.href === '/customer'
              ? pathname === '/customer'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                  active
                    ? 'border-stitch-primary bg-stitch-primary-fixed/20 text-stitch-primary'
                    : 'border-outline-variant/30 text-on-surface-variant hover:border-stitch-primary/30 hover:text-stitch-primary'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
