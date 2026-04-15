import Link from 'next/link';

const links = [
  { label: 'Catalog', href: '/catalog' },
  { label: 'Knowledge Hub', href: '/knowledge-hub' },
  { label: 'About', href: '/about' },
  { label: 'Login', href: '/login' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-outline-variant/20 bg-surface-container-lowest">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-stitch-primary">Pharma Nest</p>
          <p className="mt-0.5 text-[11px] text-on-surface-variant">
            Licensed pharmacy platform for secure medicine ordering, prescriptions, and care operations.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-stitch-primary">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
