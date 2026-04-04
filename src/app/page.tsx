import Link from 'next/link';
import { cookies } from 'next/headers';
import { AUTH_COOKIE, parseSessionToken } from '@/lib/auth';

export default async function SplashPage() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);
  const destination = session ? (session.role === 'admin' ? '/dashboard' : '/customer') : null;

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
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-stitch-primary-fixed/75">Pharma Nest</p>
            <h1 className="font-headline mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              Clinical-grade pharmacy platform.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-stitch-primary-fixed/90">
              A professional healthcare commerce experience with secure access, role-based dashboards,
              inventory workflows, prescriptions, and customer operations.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-white/20 bg-white/10 p-3">Secure Auth</div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-3">Role Dashboards</div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-3">Live Inventory</div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-3">Prescription Flow</div>
            </div>
          </section>

          <section className="flex flex-col justify-center p-8 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-stitch-secondary">Start Session</p>
            <h2 className="font-headline mt-3 text-3xl font-extrabold text-on-surface">Welcome</h2>
            <p className="mt-3 text-sm text-on-surface-variant">
              Please sign in or create an account to continue to the protected application.
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
              {destination && (
                <Link
                  href={destination}
                  className="rounded-xl border border-stitch-primary/40 bg-stitch-primary-fixed/20 px-6 py-3 text-center text-sm font-bold text-stitch-primary transition hover:bg-stitch-primary-fixed/30"
                >
                  Continue to Dashboard
                </Link>
              )}
            </div>

            <p className="mt-5 text-xs text-outline">
              Demo access works with your configured auth credentials.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
