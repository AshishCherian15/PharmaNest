import Link from 'next/link';
import { Logo } from '@/components/logo';

export default async function SplashPage() {

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-4 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-stitch-primary-fixed/20 blur-3xl" />
        <div className="absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-stitch-secondary-fixed/20 blur-3xl" />
        <div className="dot-pattern absolute inset-0 opacity-60" />
      </div>

      <main className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-outline-variant/20 bg-surface-container-lowest shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <section className="mg-gradient p-8 text-white sm:p-10">
            <div className="mb-5">
              <Logo href="/catalog" imageSize={56} alwaysShowText variant="dark" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-stitch-primary-fixed/75">Pharma Nest</p>
            <h1 className="font-headline mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              Trusted pharmacy care, delivered simply.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-stitch-primary-fixed/90">
              Order medicines, manage prescriptions, and track pharmacy operations in one verified platform
              built for patients and pharmacy teams.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-white/20 bg-white/10 p-3">Licensed Pharmacy Team</div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-3">Transparent Stock Status</div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-3">Secure Patient Sessions</div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-3">Prescription-Ready Checkout</div>
            </div>
            <p className="mt-5 text-xs text-stitch-primary-fixed/80">
              This demo workspace showcases a pharmacy storefront and operations console experience.
            </p>
          </section>

          <section className="flex flex-col justify-center p-8 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-stitch-secondary">Start Session</p>
            <h2 className="font-headline mt-3 text-3xl font-extrabold text-on-surface">Welcome</h2>
            <p className="mt-3 text-sm text-on-surface-variant">
              Sign in as a customer or staff member to explore the full end-to-end pharmacy workflow.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Link href="/login" className="btn-primary-gradient px-6 py-3 text-center text-sm">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-outline-variant/30 px-6 py-3 text-center text-sm font-bold text-on-surface transition hover:bg-surface-container-low"
              >
                Register
              </Link>
            </div>

            <p className="mt-5 text-xs text-outline">
              Demo credentials are available on the login screen and can autofill with one click.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
