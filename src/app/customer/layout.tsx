import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE, parseSessionToken } from '@/lib/auth';
import { CustomerNav } from '@/components/customer/customer-nav';
import { BackButton } from '@/components/navigation/back-button';
import { Logo } from '@/components/logo';
import { UserNav } from '@/components/user-nav';
import { mockUser } from '@/lib/data';
import { SiteFooter } from '@/components/site-footer';
import { isDemoModeEnabled } from '@/lib/demo-mode';

const navItems = [
  { href: '/customer',               label: 'Overview'       },
  { href: '/catalog',                label: 'Shop'           },
  { href: '/customer/cart',          label: 'Cart'           },
  { href: '/customer/orders',        label: 'My Orders'      },
  { href: '/customer/prescriptions', label: 'Prescriptions'  },
  { href: '/customer/profile',       label: 'Profile'        },
];

const mobileNav = [
  { href: '/customer',               icon: '🏠', label: 'Home'    },
  { href: '/catalog',                icon: '💊', label: 'Shop'    },
  { href: '/customer/cart',          icon: '🛒', label: 'Cart'    },
  { href: '/customer/orders',        icon: '📦', label: 'Orders'  },
  { href: '/customer/profile',       icon: '👤', label: 'Profile' },
];

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);
  const demoMode = isDemoModeEnabled();

  if (!demoMode && (!session || session.role !== 'customer')) {
    redirect('/login');
  }

  const profile = {
    name: session?.name ?? 'Demo Customer',
    email: session?.email ?? 'demo.customer@pharmanest.com',
    avatarId: mockUser.avatarId,
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Sticky header ── */}
      <header className="glass-nav sticky top-0 z-40 border-b border-outline-variant/20 shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <BackButton fallbackHref="/" className="flex-shrink-0" />

          {/* Logo */}
          <Logo href="/catalog" imageSize={36} alwaysShowText className="flex-shrink-0" />

          {/* Desktop nav */}
          <CustomerNav items={navItems} />

          {/* User avatar */}
          <div className="ml-auto flex-shrink-0">
            <UserNav user={profile} />
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:px-8 md:pb-6">
        <section className="mb-6 rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-stitch-primary">Customer Care Center</p>
              <p className="mt-1 text-sm text-on-surface-variant">
                Manage prescriptions, order updates, and medicine continuity from one secure customer workspace.
              </p>
            </div>
            <Link href="/knowledge-hub" className="inline-flex rounded-xl border border-stitch-primary/30 px-4 py-2 text-xs font-bold text-stitch-primary transition hover:bg-stitch-primary-fixed/15">
              Read Care Guides
            </Link>
          </div>
        </section>
        {children}
      </main>

      <SiteFooter />

      {/* ── Mobile bottom nav ── */}
      <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-outline-variant/20 bg-surface-container-lowest/95 backdrop-blur-lg md:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {mobileNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-on-surface-variant transition hover:text-stitch-primary"
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
