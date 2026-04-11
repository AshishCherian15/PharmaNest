'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import { useStoreCart } from '@/hooks/use-store-cart';
import { Logo } from '@/components/logo';

const navCats = [
  { label: 'All',          value: 'all'           },
  { label: 'Medicines',    value: 'Painkiller'    },
  { label: 'Vitamins',     value: 'Vitamins'      },
  { label: 'Personal Care',value: 'Personal Care' },
  { label: 'Devices',      value: 'Medical Devices'},
  { label: 'Baby Care',    value: 'Baby Care'     },
  { label: 'Ayurveda',     value: 'Health Foods'  },
];

const navLinks = [
  { href: '/catalog',        label: 'Home'          },
  { href: '/catalog',        label: 'Shop'          },
  { href: '/knowledge-hub',  label: 'Knowledge Hub' },
  { href: '/about',          label: 'About Us'      },
];

export function LandingHeader() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery]           = useState(searchParams.get('q') ?? '');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useStoreCart();

  const onCatalog = pathname === '/catalog';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (onCatalog) {
      const p = new URLSearchParams(searchParams.toString());
      if (q) p.set('q', q); else p.delete('q');
      p.delete('page');
      router.push(`/catalog?${p.toString()}`);
    } else {
      const p = new URLSearchParams();
      if (q) p.set('q', q);
      router.push(p.toString() ? `/?${p.toString()}#featured-products` : '/#featured-products');
    }
  };

  const handleCatClick = (val: string) => {
    if (onCatalog) {
      const p = new URLSearchParams(searchParams.toString());
      if (val === 'all') p.delete('category'); else p.set('category', val);
      p.delete('page');
      router.push(`/catalog?${p.toString()}`);
    } else {
      if (val === 'all') router.push('/#featured-products');
      else router.push(`/?category=${encodeURIComponent(val)}#featured-products`);
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full">

      {/* ── Top info bar ── */}
      <div className="hidden bg-stitch-primary md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-8 items-center justify-between text-xs text-stitch-primary-fixed/80">
            <span>📍 Delivery in Mysuru · Bengaluru · Chennai · Mumbai</span>
            <span>📞 1800-XXX-XXXX &nbsp;|&nbsp; Mon–Sat 9am–6pm</span>
          </div>
        </div>
      </div>

      {/* ── Main nav ── */}
      <header className="glass-nav border-b border-outline-variant/20 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3">

            {/* Mobile hamburger */}
            <button
              className="flex-shrink-0 rounded-lg p-2 text-on-surface transition hover:bg-surface-container-low md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo */}
            <Logo href="/catalog" alwaysShowText className="flex-shrink-0 mr-1" />

            {/* Desktop nav links */}
            <nav className="hidden items-center gap-5 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors hover:text-stitch-primary ${
                    (link.href === '/' ? pathname === '/' : pathname.startsWith(link.href) && link.href !== '/')
                      ? 'text-stitch-primary'
                      : 'text-on-surface-variant'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="mx-3 hidden min-w-0 flex-1 items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container-low px-4 py-2 max-w-md transition focus-within:border-stitch-primary/50 focus-within:ring-2 focus-within:ring-stitch-primary/10 md:flex"
            >
              <Search className="h-4 w-4 flex-shrink-0 text-outline" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search medicines, vitamins, devices…"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-outline text-on-surface"
              />
              <button
                type="submit"
                className="rounded-full bg-stitch-primary px-3 py-1 text-xs font-bold text-white transition hover:bg-stitch-primary-container active:scale-95"
              >
                Search
              </button>
            </form>

            {/* Actions */}
            <div className="flex flex-shrink-0 items-center gap-2">
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-full border border-stitch-primary px-4 py-1.5 text-sm font-semibold text-stitch-primary transition hover:bg-stitch-primary-fixed/20 active:scale-95 md:flex"
              >
                <User className="h-3.5 w-3.5" />
                Login
              </Link>
              <Link
                href="/customer/cart"
                className="relative flex items-center gap-1.5 rounded-full bg-stitch-primary px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-stitch-primary-container active:scale-95"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Cart</span>
                {itemCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-stitch-primary">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Category nav bar ── */}
        <div className="border-t border-outline-variant/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto scrollbar-hide">
              {navCats.map((cat) => {
                const isActive = onCatalog
                  ? (cat.value === 'all' ? !searchParams.get('category') : searchParams.get('category') === cat.value)
                  : (cat.value === 'all' ? !searchParams.get('category') : searchParams.get('category') === cat.value);
                return (
                  <button
                    key={cat.value}
                    onClick={() => handleCatClick(cat.value)}
                    className={`nav-cat ${isActive ? 'nav-cat-active' : ''}`}
                  >
                    {cat.label}
                  </button>
                );
              })}
              <Link href="/catalog" className="nav-cat whitespace-nowrap text-stitch-primary font-bold">
                View All →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="glass-nav border-b border-outline-variant/20 md:hidden">
          <div className="space-y-2 px-4 py-4">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2.5">
              <Search className="h-4 w-4 flex-shrink-0 text-outline" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search medicines…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-outline"
              />
              <button type="submit" className="rounded-full bg-stitch-primary px-3 py-1 text-xs font-bold text-white">Go</button>
            </form>

            {/* Nav links */}
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-low hover:text-stitch-primary"
              >
                {link.label}
              </Link>
            ))}

            {/* Auth buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-stitch-primary py-2.5 text-center text-sm font-bold text-stitch-primary transition hover:bg-stitch-primary-fixed/10"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="btn-primary-gradient rounded-xl py-2.5 text-center text-sm"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
