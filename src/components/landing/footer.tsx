import Link from 'next/link';
import { Logo } from '@/components/logo';

const quickLinks = [
  { label: 'Home',             href: '/'                    },
  { label: 'Medicines Catalog',href: '/catalog'             },
  { label: 'New Arrivals',     href: '/catalog?sort=newest' },
  { label: 'Knowledge Hub',    href: '/knowledge-hub'       },
  { label: 'About Us',         href: '/#why-choose'         },
];

const customerLinks = [
  { label: 'My Account',      href: '/customer'              },
  { label: 'My Orders',       href: '/customer/orders'       },
  { label: 'Prescriptions',   href: '/customer/prescriptions'},
  { label: 'Cart',            href: '/customer/cart'         },
  { label: 'Track Order',     href: '/customer/orders'       },
];

const supportLinks = [
  { label: 'Help Center',     href: '/#contact' },
  { label: 'Returns & Refunds',href: '/#contact'},
  { label: 'FAQs',            href: '/#contact' },
  { label: 'Contact Us',      href: '/#contact' },
  { label: 'Privacy Policy',  href: '/#contact' },
];

export function LandingFooter() {
  return (
    <footer id="contact" className="bg-stitch-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 py-14 sm:grid-cols-2 md:grid-cols-5 lg:gap-10">

          {/* Brand */}
          <div className="col-span-2 space-y-5 md:col-span-2">
            <Logo href="/" imageSize={44} alwaysShowText variant="dark" />
            <p className="max-w-[260px] text-[13px] leading-relaxed text-stitch-primary-fixed/55">
              India's most trusted online pharmacy — delivering genuine medicines at the best prices, with same-day delivery across 50+ cities.
            </p>
            {/* Contact */}
            <div className="space-y-1.5 text-[12px] text-stitch-primary-fixed/50">
              <p>📧 support@pharmanest.in</p>
              <p>📞 1800-XXX-XXXX (Mon–Sat, 9am–6pm)</p>
              <p>📍 Mysuru, Karnataka, India</p>
            </div>
            {/* Newsletter */}
            <div>
              <p className="mb-2 text-[12px] font-semibold text-stitch-primary-fixed/70">Get health tips & deals</p>
              <div className="flex h-10 gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="h-full min-w-0 flex-1 rounded-xl border border-stitch-primary-fixed/20 bg-white/10 px-3 text-[13px] text-stitch-primary-fixed outline-none placeholder:text-stitch-primary-fixed/60"
                />
                <button
                  className="h-full flex-shrink-0 rounded-xl px-4 text-[12px] font-bold text-stitch-primary transition hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: 'rgb(var(--stitch-primary-fixed))' }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-stitch-primary-fixed/60">Quick Links</p>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[12px] text-stitch-primary-fixed/45 transition-colors hover:text-stitch-primary-fixed">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer */}
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-stitch-primary-fixed/60">My Account</p>
            <ul className="space-y-2.5">
              {customerLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[12px] text-stitch-primary-fixed/45 transition-colors hover:text-stitch-primary-fixed">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-stitch-primary-fixed/60">Support</p>
            <ul className="space-y-2.5">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[12px] text-stitch-primary-fixed/45 transition-colors hover:text-stitch-primary-fixed">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stitch-primary-fixed/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-2 py-4 text-[11px] text-stitch-primary-fixed/30 sm:flex-row">
            <p>© {new Date().getFullYear()} Pharma Nest · Licensed pharmacy platform · All rights reserved</p>
            <div className="flex gap-4">
              {['Privacy', 'Terms', 'Licenses', 'Sitemap'].map((l) => (
                <Link key={l} href="/#contact" className="transition-colors hover:text-stitch-primary-fixed">
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
