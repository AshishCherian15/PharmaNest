import Link from 'next/link';
import { Suspense } from 'react';
import { LandingHeader } from '@/components/landing/header';
import { LandingFooter } from '@/components/landing/footer';

const articles = [
  { tag: 'How It Works', title: 'How We Store & Deliver Your Medicines', desc: 'Learn how we keep your medications safe from storage to delivery. Proper storage = better results.', author: 'PharmaNest Team', emoji: '🚚', bg: 'bg-stitch-primary-fixed/20' },
  { tag: 'Medication', title: 'Getting the Most From Your Medicines', desc: 'Simple tips on timing, storage, and recognizing side effects. Your pharmacist is always here to help.', author: 'PharmaNest Team', emoji: '💊', bg: 'bg-stitch-secondary-fixed/20' },
  { tag: 'Health Tips', title: 'Managing Long-Term Conditions at Home', desc: 'Practical advice for staying healthy while managing chronic conditions. Managing diabetes, blood pressure, and more.', author: 'PharmaNest Team', emoji: '🏠', bg: 'bg-amber-100' },
];

const bentoItems = [
  { title: 'Find Your Medicine', desc: 'Search by symptom, condition, or brand. Get instant information on uses, precautions, and cost.', icon: '🔍', bg: 'bg-stitch-primary-container', textColor: 'text-white', span: 'md:col-span-2 md:row-span-2', minH: 'min-h-[280px]' },
  { title: 'Medicine FAQs',    desc: 'Common questions about taking medicines safely, side effects, and what to expect.',                          icon: '❓', bg: 'bg-surface-container-lowest border border-outline-variant/20', textColor: 'text-on-surface', span: 'md:col-span-2', minH: 'min-h-[130px]' },
  { title: 'Talk to Pharmacist',                desc: 'Have questions? Chat with our licensed pharmacists during business hours.',                              icon: '💬', bg: 'bg-stitch-secondary-container', textColor: 'text-on-stitch-secondary-container', span: '', minH: 'min-h-[130px]' },
  { title: 'Health Tips',            desc: 'Simple wellness advice: managing conditions, medication timing, storage tips.',                                        icon: '📚', bg: 'bg-stitch-tertiary-fixed',      textColor: 'text-on-surface', span: '', minH: 'min-h-[130px]' },
];

export default function KnowledgeHubPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Suspense fallback={<div className="h-[88px] border-b border-outline-variant/20 bg-surface-container-lowest" />}>
        <LandingHeader />
      </Suspense>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="bg-surface-container-low">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              <div className="space-y-6">
                <span className="text-xs font-bold uppercase tracking-widest text-stitch-secondary">Help & Resources</span>
                <h1 className="font-headline text-5xl font-extrabold leading-tight tracking-tight text-stitch-primary lg:text-6xl">
                  Take Control<br />of Your Health.
                </h1>
                <p className="max-w-xl text-lg font-light leading-relaxed text-on-surface-variant">
                  Find medication information, get pharmacy advice, and learn how to manage your health at home. We're here to help with clear, simple answers.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="btn-primary-gradient px-8 py-3 shadow-lg">Browse Health Topics</button>
                  <button className="rounded-xl bg-surface-container-lowest px-8 py-3 font-bold text-stitch-primary transition hover:bg-surface-container-high">
                    Ask Pharmacist
                  </button>
                </div>
              </div>
              <div className="flex h-72 items-center justify-center rounded-2xl bg-stitch-primary-fixed/20 text-8xl lg:h-96">
                📖
              </div>
            </div>
          </div>
        </section>

        {/* ── Bento grid ── */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4 md:grid-rows-2">
            {bentoItems.map((item) => (
              <div
                key={item.title}
                className={`bento-card ${item.bg} ${item.span} ${item.minH} ${item.textColor} flex flex-col justify-between p-7`}
              >
                <div>
                  <div className="mb-4 text-4xl">{item.icon}</div>
                  <h3 className="font-headline text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm opacity-80">{item.desc}</p>
                </div>
                <button className="mt-4 w-fit rounded-lg bg-white/15 px-4 py-1.5 text-xs font-bold backdrop-blur-sm transition hover:bg-white/25">
                  Explore →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recent publications ── */}
        <section className="bg-surface-container-low py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="font-headline text-3xl font-bold tracking-tight text-stitch-primary">Recent Publications</h2>
                <div className="mt-2 h-1 w-20 rounded-full bg-stitch-primary" />
              </div>
              <button className="font-bold text-stitch-primary hover:underline">View All Archives →</button>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {articles.map((a) => (
                <div key={a.title} className="stitch-product-card border border-outline-variant/20 cursor-pointer group">
                  <div className={`flex h-48 items-center justify-center text-6xl ${a.bg}`}>
                    {a.emoji}
                  </div>
                  <div className="p-5 space-y-3">
                    <span className="rounded bg-stitch-secondary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-stitch-secondary">
                      {a.tag}
                    </span>
                    <h4 className="font-headline text-xl font-bold text-stitch-primary transition group-hover:text-stitch-secondary">
                      {a.title}
                    </h4>
                    <p className="line-clamp-2 text-sm text-on-surface-variant">{a.desc}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-sm">👤</div>
                      <span className="text-xs font-semibold text-stitch-primary">{a.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter CTA ── */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mg-gradient relative overflow-hidden rounded-3xl p-10 text-center lg:p-16">
              <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rotate-45 rounded-3xl bg-white/5" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-stitch-secondary/20 blur-2xl" />
              <div className="relative z-10 space-y-6">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Stay informed with the Sanctuary Letter.
                </h2>
                <p className="mx-auto max-w-xl text-white/80">
                  Monthly insights into pharmaceutical research, safety updates, and exclusive clinical guides.
                </p>
                <div className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    placeholder="professional@email.com"
                    className="grow rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-stitch-primary-fixed"
                  />
                  <button className="rounded-xl bg-white px-8 py-3 font-bold text-stitch-primary transition hover:bg-stitch-primary-fixed">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <LandingFooter />
    </div>
  );
}
