import Link from 'next/link';
import { Logo } from '@/components/logo';
import { SiteFooter } from '@/components/site-footer';
import { landingProducts, mockMedicines } from '@/lib/data';

const trustBadges = [
  'Licensed Pharmacy Team',
  'Prescription Validation Workflow',
  'Cold-Chain Aware Handling',
  'GST-Compliant Billing',
];

const carePillars = [
  {
    title: 'Prescription-Safe Ordering',
    description:
      'Restricted medicines are routed through prescription eligibility and pharmacist review before fulfillment.',
    icon: 'Rx',
  },
  {
    title: 'Live Stock Transparency',
    description:
      'Know availability before checkout with stock-aware catalog, reorder visibility, and clear fulfillment signals.',
    icon: 'ST',
  },
  {
    title: 'Patient-First Operations',
    description:
      'From delivery updates to account history, every touchpoint is designed for trust and continuity of care.',
    icon: 'PT',
  },
];

const processSteps = [
  {
    title: 'Discover Medicines',
    detail:
      'Search by medicine, generic name, or category and compare options with pricing and stock context.',
  },
  {
    title: 'Validate and Checkout',
    detail:
      'Upload prescriptions when needed, then proceed with secure checkout and compliant order capture.',
  },
  {
    title: 'Track and Reorder',
    detail:
      'Monitor order status, review prescription progress, and quickly reorder essentials from your account.',
  },
];

const outcomeStats = [
  { value: '50+', label: 'Serviceable Cities' },
  { value: '99.9%', label: 'Order Data Integrity' },
  { value: '24/7', label: 'Workflow Availability' },
  { value: '10k+', label: 'Simulated Order Runs' },
];

const formShowcase = [
  { key: 'tablets', title: 'Tablets', subtitle: 'Everyday fever and pain care', productId: 'MED001' },
  { key: 'capsules', title: 'Capsules', subtitle: 'Antibiotics and nutrition support', productId: 'MED002' },
  { key: 'syrups', title: 'Syrups', subtitle: 'Adult and pediatric liquid options', productId: 'MED011' },
  { key: 'drops', title: 'Drops', subtitle: 'Baby care and vitamin supplements', productId: 'MED014' },
];

export default async function SplashPage() {
  return (
    <div className="bg-surface">
      <header className="border-b border-outline-variant/20 bg-surface-container-lowest/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Logo href="/" imageSize={44} alwaysShowText />
          <div className="flex items-center gap-2">
            <Link
              href="/about"
              className="rounded-xl border border-outline-variant/30 px-4 py-2 text-sm font-bold text-on-surface transition hover:bg-surface-container-low"
            >
              About PharmaNest
            </Link>
            <Link href="/login" className="btn-primary-gradient px-4 py-2 text-sm">
              Login
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-12 pt-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 top-6 h-80 w-80 rounded-full bg-stitch-primary-fixed/20 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-stitch-secondary-fixed/20 blur-3xl" />
          <div className="dot-pattern absolute inset-0 opacity-55" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl overflow-hidden rounded-3xl border border-outline-variant/20 bg-surface-container-lowest shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <section className="mg-gradient p-8 text-white sm:p-10 lg:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-stitch-primary-fixed/80">Pharma Nest Platform</p>
              <h1 className="mt-4 font-headline text-4xl font-extrabold leading-tight sm:text-5xl">
                Your neighborhood pharmacy, now easy and reliable online.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-stitch-primary-fixed/90 sm:text-base">
                Find genuine medicines, place orders in minutes, and keep prescriptions organized in one place.
                PharmaNest keeps things simple for families while giving pharmacy teams full control behind the scenes.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                {trustBadges.map((badge) => (
                  <div key={badge} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5">
                    {badge}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-stitch-primary transition hover:bg-stitch-primary-fixed">
                  Start with Login
                </Link>
                <Link href="/about" className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">
                  Learn About Us
                </Link>
              </div>
            </section>

            <section className="p-8 sm:p-10 lg:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-stitch-secondary">Why Patients Choose Us</p>
              <h2 className="mt-3 font-headline text-3xl font-extrabold text-on-surface">Feels simple. Works like a full pharmacy network.</h2>
              <p className="mt-3 text-sm text-on-surface-variant">
                From product discovery to doorstep tracking, every step is built to feel natural for customers
                and practical for pharmacists, staff, and owners.
              </p>

              <div className="mt-7 space-y-3">
                {carePillars.map((pillar) => (
                  <article key={pillar.title} className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-stitch-primary-fixed/20 text-[11px] font-extrabold text-stitch-primary">
                        {pillar.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-on-surface">{pillar.title}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">{pillar.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 sm:p-8">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stitch-primary">Care Journey</p>
              <h2 className="mt-2 font-headline text-2xl font-extrabold text-on-surface">How PharmaNest works end to end</h2>
            </div>
            <Link href="/knowledge-hub" className="text-sm font-bold text-stitch-primary hover:underline">
              Explore patient guides {'->'}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-outline-variant/20 bg-surface p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-outline">Step {index + 1}</p>
                <h3 className="mt-2 text-lg font-extrabold text-on-surface">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{step.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 sm:p-8">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stitch-primary">Product Forms</p>
              <h2 className="mt-2 font-headline text-2xl font-extrabold text-on-surface">Tablets, capsules, syrups, drops and more</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Real products from your catalog are highlighted here so the landing page feels like a real pharmacy storefront.
              </p>
            </div>
            <Link href="/login" className="text-sm font-bold text-stitch-primary hover:underline">Open your account {'->'}</Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {formShowcase.map((item) => {
              const product = [...mockMedicines, ...landingProducts].find((p) => p.id === item.productId);
              if (!product) return null;
              return (
                <Link key={item.key} href={`/products/${product.id}`} className="rounded-2xl border border-outline-variant/20 bg-surface p-4 transition hover:-translate-y-0.5 hover:border-stitch-primary/30 hover:shadow-md">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-stitch-secondary">{item.title}</p>
                  <h3 className="mt-2 text-base font-extrabold text-on-surface">{product.name}</h3>
                  <p className="mt-1 text-xs text-on-surface-variant">{item.subtitle}</p>
                  <p className="mt-3 text-sm font-bold text-stitch-primary">
                    {(product.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4 px-4 pb-12 sm:grid-cols-4 sm:px-6 lg:px-8">
        {outcomeStats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 text-center">
            <p className="font-headline text-2xl font-extrabold text-stitch-primary">{stat.value}</p>
            <p className="mt-1 text-xs font-semibold text-on-surface-variant">{stat.label}</p>
          </article>
        ))}
      </section>

      <SiteFooter />
    </div>
  );
}
