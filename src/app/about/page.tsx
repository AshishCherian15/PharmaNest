import Link from 'next/link';
import { LandingHeader } from '@/components/landing/header';
import { LandingFooter } from '@/components/landing/footer';

const pillars = [
  {
    title: 'Licensed & Verified Medicines',
    description: 'We source only from verified distributors and maintain strict quality checks before dispatch.',
  },
  {
    title: 'Fast, Safe Deliveries',
    description: 'Temperature-sensitive products are handled with cold-chain awareness and tracked logistics.',
  },
  {
    title: 'Care-Focused Support',
    description: 'Patients can reach our support team for prescription help, refill guidance, and order updates.',
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <LandingHeader />

      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-3xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="mg-gradient p-8 text-white sm:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-stitch-primary-fixed/80">About Pharma Nest</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">Trusted pharmacy care for every family.</h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-stitch-primary-fixed/90 sm:text-base">
                Pharma Nest was built to make healthcare access easier with genuine medicines, transparent stock,
                and dependable support from checkout to delivery.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/catalog"
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-stitch-primary transition hover:bg-stitch-primary-fixed"
                >
                  Explore Products
                </Link>
                <Link
                  href="/knowledge-hub"
                  className="rounded-xl border border-white/35 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Read Health Guides
                </Link>
              </div>
            </div>

            <div className="grid gap-4 p-8 sm:p-12">
              {pillars.map((pillar) => (
                <article key={pillar.title} className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-5">
                  <h2 className="text-lg font-extrabold text-on-surface">{pillar.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{pillar.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
