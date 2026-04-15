import Link from 'next/link';
import { cookies } from 'next/headers';
import { AUTH_COOKIE, parseSessionToken } from '@/lib/auth';
import { getOrdersForCustomerDb } from '@/lib/customer-orders-db';
import { getPrescriptionsForCustomer } from '@/lib/prescriptions';
import { landingProducts } from '@/lib/data';

export default async function CustomerOverviewPage() {
  const token   = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);
  let orders = [] as Awaited<ReturnType<typeof getOrdersForCustomerDb>>;
  let rxList = [] as Awaited<ReturnType<typeof getPrescriptionsForCustomer>>;

  if (session) {
    try {
      [orders, rxList] = await Promise.all([
        getOrdersForCustomerDb(session.id),
        getPrescriptionsForCustomer(session.id),
      ]);
    } catch {
      // Demo-mode fallback: preserve UI without requiring DB reads.
      orders = [];
      rxList = [];
    }
  }
  const recentOrder = orders[0] ?? null;
  const pendingRxCount = rxList.filter((r) => r.status === 'pending').length;
  const verifiedRxCount = rxList.filter((r) => r.status === 'verified').length;

  const quickReorder = landingProducts.slice(0, 3);

  return (
    <div className="space-y-8">

      {/* ── Welcome banner ── */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Main banner */}
        <div className="mg-gradient relative col-span-1 flex min-h-[220px] flex-col justify-center overflow-hidden rounded-2xl p-8 text-white lg:col-span-2">
          <div className="pointer-events-none absolute inset-0 opacity-10"
            style={{ background: 'radial-gradient(ellipse at 80% 50%, rgb(var(--stitch-primary-fixed)) 0%, transparent 60%)' }} />
          <div className="relative z-10 max-w-md">
            <p className="text-xs font-bold uppercase tracking-widest text-stitch-primary-fixed/70">Welcome back</p>
            <h2 className="font-headline mt-1 text-3xl font-extrabold">
              {session?.name ?? 'Customer'} 👋
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              Your health dashboard is ready. Track orders, manage prescriptions, and reorder essentials.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/catalog" className="rounded-xl bg-stitch-primary-fixed px-5 py-2.5 text-sm font-bold text-stitch-primary transition hover:bg-white active:scale-95">
                Shop Now
              </Link>
              <Link href="/customer/orders" className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10 active:scale-95">
                My Orders
              </Link>
            </div>
          </div>
        </div>

        {/* Recent order card */}
        <div className="flex flex-col justify-between rounded-2xl bg-surface-container-low p-6">
          <div>
            <div className="mb-3 flex items-start justify-between">
              <h3 className="font-headline text-base font-bold text-on-surface">Recent Order</h3>
              {recentOrder ? (
                <span className="rounded-full bg-stitch-secondary-fixed px-2.5 py-1 text-[10px] font-bold uppercase tracking-tight text-on-stitch-secondary-fixed">
                  {recentOrder.status}
                </span>
              ) : null}
            </div>
            {recentOrder ? (
              <>
                <p className="text-xs font-medium text-on-surface-variant">Order #{recentOrder.id}</p>
                <p className="mt-1 font-bold text-on-surface">
                  {recentOrder.items.length} item{recentOrder.items.length !== 1 ? 's' : ''}
                </p>
                <p className="mt-1 text-sm font-extrabold text-stitch-primary">
                  {(recentOrder.total / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </p>
              </>
            ) : (
              <p className="text-sm text-on-surface-variant">No orders yet.</p>
            )}
          </div>
          <Link href="/customer/orders" className="mt-4 text-sm font-bold text-stitch-primary underline decoration-2 underline-offset-4 hover:text-stitch-primary-container">
            {recentOrder ? 'Track Order →' : 'Browse Products →'}
          </Link>
        </div>
      </section>

      {/* ── Stats row ── */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Orders',    value: orders.length,                                  icon: '📦', color: 'bg-stitch-primary-fixed/20 text-stitch-primary' },
          { label: 'Prescriptions',   value: rxList.length,                                  icon: '📋', color: 'bg-stitch-secondary-fixed/20 text-stitch-secondary' },
          { label: 'Pending Rx',      value: pendingRxCount, icon: '⏳', color: 'bg-amber-100 text-amber-700' },
          { label: 'Verified Rx',     value: verifiedRxCount, icon: '✅', color: 'bg-green-100 text-green-700' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-xl ${s.color}`}>
              {s.icon}
            </div>
            <p className="font-headline text-2xl font-extrabold text-on-surface">{s.value}</p>
            <p className="mt-0.5 text-xs font-medium text-on-surface-variant">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-outline">Recommended Next Step</p>
            {pendingRxCount > 0 ? (
              <>
                <h3 className="mt-1 font-headline text-lg font-extrabold text-on-surface">Complete your prescription review</h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  You have {pendingRxCount} prescription request{pendingRxCount !== 1 ? 's' : ''} waiting for validation.
                </p>
              </>
            ) : orders.length === 0 ? (
              <>
                <h3 className="mt-1 font-headline text-lg font-extrabold text-on-surface">Place your first order</h3>
                <p className="mt-1 text-sm text-on-surface-variant">Start with common essentials and check live stock availability in the catalog.</p>
              </>
            ) : (
              <>
                <h3 className="mt-1 font-headline text-lg font-extrabold text-on-surface">Your account is in good shape</h3>
                <p className="mt-1 text-sm text-on-surface-variant">Verified prescriptions: {verifiedRxCount}. You can reorder past medicines in a few taps.</p>
              </>
            )}
          </div>
          <Link
            href={pendingRxCount > 0 ? '/customer/prescriptions' : '/catalog'}
            className="inline-flex rounded-xl bg-stitch-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-stitch-primary-container"
          >
            {pendingRxCount > 0 ? 'Review Prescriptions' : 'Continue Shopping'}
          </Link>
        </div>
      </section>

      {/* ── Active prescriptions ── */}
      {rxList.length > 0 && (
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="font-headline text-xl font-extrabold text-on-surface">Active Prescriptions</h2>
              <p className="mt-0.5 text-sm text-on-surface-variant">Currently tracking {rxList.length} item{rxList.length !== 1 ? 's' : ''}</p>
            </div>
            <Link href="/customer/prescriptions" className="flex items-center gap-1 text-sm font-bold text-stitch-primary hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rxList.slice(0, 3).map((rx) => {
              const supplyPct = rx.status === 'verified' ? 90 : rx.status === 'pending' ? 40 : 15;
              const barColor  = rx.status === 'verified' ? 'rgb(var(--stitch-primary))' : rx.status === 'pending' ? 'rgb(245 158 11)' : 'rgb(var(--error))';
              const iconBg    = rx.status === 'verified' ? 'bg-stitch-secondary-container/30' : rx.status === 'pending' ? 'bg-stitch-primary-fixed/30' : 'bg-stitch-tertiary-fixed';
              const iconColor = rx.status === 'verified' ? 'text-stitch-secondary' : rx.status === 'pending' ? 'text-stitch-primary' : 'text-stitch-tertiary';
              const statusLabel = rx.status === 'verified' ? 'Verified' : rx.status === 'pending' ? 'Needs Refill' : 'Rejected';
              const statusColor = rx.status === 'verified' ? 'text-green-700' : rx.status === 'pending' ? 'text-amber-700' : 'text-red-700';

              return (
                <div key={rx.id} className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-5 flex items-start justify-between">
                    <div className={`rounded-xl p-3 ${iconBg}`}>
                      <span className={`text-xl ${iconColor}`}>💊</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <h4 className="font-headline text-lg font-bold text-on-surface">{rx.id}</h4>
                  <p className="mt-1 text-sm text-on-surface-variant">Dr. {rx.doctorName} · {rx.date}</p>
                  <div className="mt-5 space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">
                      <span>Supply remaining</span>
                      <span>{supplyPct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
                      <div className="h-full rounded-full transition-all" style={{ width: `${supplyPct}%`, background: barColor }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Quick reorder + saved ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Quick reorder */}
        <section>
          <h3 className="font-headline mb-5 text-xl font-extrabold text-on-surface">Essentials Quick Re-order</h3>
          <div className="overflow-hidden rounded-2xl bg-surface-container-low">
            {quickReorder.map((product, idx) => (
              <div key={product.id} className={`flex items-center gap-4 p-4 transition hover:bg-surface-container-high ${idx < quickReorder.length - 1 ? 'border-b border-outline-variant/10' : ''}`}>
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-stitch-primary-fixed/20 text-2xl">
                  💊
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-bold text-sm text-on-surface">{product.name}</p>
                  <p className="text-xs text-on-surface-variant">{product.genericName} · {(product.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                </div>
                <Link
                  href={`/products/${product.id}`}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-stitch-primary text-white transition hover:bg-stitch-primary-container active:scale-90"
                >
                  +
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <h3 className="font-headline mb-5 text-xl font-extrabold text-on-surface">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Browse Catalog',    href: '/catalog',                  icon: '💊', desc: '1000+ products' },
              { label: 'My Cart',           href: '/customer/cart',            icon: '🛒', desc: 'Review & checkout' },
              { label: 'Upload Rx',         href: '/customer/prescriptions',   icon: '📄', desc: 'Submit for review' },
              { label: 'Track Orders',      href: '/customer/orders',          icon: '🚚', desc: 'Live status' },
            ].map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex flex-col items-center rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-stitch-primary/30 hover:shadow-md"
              >
                <span className="mb-2 text-3xl">{a.icon}</span>
                <p className="text-sm font-bold text-on-surface">{a.label}</p>
                <p className="mt-0.5 text-[11px] text-on-surface-variant">{a.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ── Security trust ── */}
      <section className="flex flex-col items-center gap-6 rounded-2xl border border-stitch-primary/10 bg-stitch-primary/5 p-8 md:flex-row">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-lg text-3xl">
          🔒
        </div>
        <div className="flex-1">
          <h3 className="font-headline text-lg font-bold text-on-surface">Security You Can Rely On</h3>
          <p className="mt-1 max-w-xl text-sm text-on-surface-variant">
            Pharma Nest protects account and order data using encrypted sessions, signed authentication tokens, and role-based access controls across customer and admin workflows.
          </p>
        </div>
        <Link href="/knowledge-hub" className="flex-shrink-0 rounded-xl border-2 border-stitch-primary px-6 py-2.5 text-sm font-bold text-stitch-primary transition hover:bg-stitch-primary hover:text-white">
          Explore Knowledge Hub
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {[
          {
            title: 'Medication Safety Program',
            badge: 'Safety Layer',
            points: [
              'Automatic prescription checks for restricted medicines.',
              'Pharmacist review workflow with verification notes.',
              'Clear status updates: pending, verified, or rejected.',
            ],
          },
          {
            title: 'Delivery & Refill Planning',
            badge: 'Care Continuity',
            points: [
              'Track order progress from placed to delivered.',
              'Quick reorder essentials from your history.',
              'Reduce missed doses with proactive refill visibility.',
            ],
          },
          {
            title: 'Account & Data Protection',
            badge: 'Trust',
            points: [
              'Signed sessions and role-based access controls.',
              'Protected customer modules and order history.',
              'Secure profile management and consent-aware workflows.',
            ],
          },
        ].map((card) => (
          <article key={card.title} className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-stitch-primary">{card.badge}</p>
            <h3 className="mt-2 font-headline text-lg font-extrabold text-on-surface">{card.title}</h3>
            <ul className="mt-4 space-y-2 text-sm text-on-surface-variant">
              {card.points.map((point) => (
                <li key={point}>• {point}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-stitch-secondary">How PharmaNest Works</p>
            <h3 className="mt-2 font-headline text-2xl font-extrabold text-on-surface">From prescription to delivery in one connected journey</h3>
            <p className="mt-2 text-sm text-on-surface-variant">
              Browse medicines, upload prescriptions when required, receive pharmacist review, and place orders with transparent status updates at every step.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm text-on-surface-variant sm:grid-cols-3 lg:w-[420px]">
            <div className="rounded-xl bg-surface-container-lowest p-3"><span className="font-bold text-on-surface">1.</span> Select products</div>
            <div className="rounded-xl bg-surface-container-lowest p-3"><span className="font-bold text-on-surface">2.</span> Verify prescription</div>
            <div className="rounded-xl bg-surface-container-lowest p-3"><span className="font-bold text-on-surface">3.</span> Track delivery</div>
          </div>
        </div>
      </section>
    </div>
  );
}
