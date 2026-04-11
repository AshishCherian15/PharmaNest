'use client';

import type { AuthRole } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, UserRound, KeyRound, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

const DEMO_CREDENTIALS: Record<AuthRole, { identifier: string; password: string; label: string }> = {
  admin: {
    identifier: 'admin@pharmanest.com',
    password: 'admin',
    label: 'Admin Demo',
  },
  customer: {
    identifier: 'customer@pharmanest.com',
    password: 'admin',
    label: 'Customer Demo',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [role, setRole] = useState<AuthRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const applyDemo = (r: AuthRole) => {
    setEmail(DEMO_CREDENTIALS[r].identifier);
    setPassword(DEMO_CREDENTIALS[r].password);
  };

  const selectRole = (r: AuthRole) => {
    setRole(r);
    applyDemo(r);
    setStep('form');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? 'Unable to sign in');
      }
      router.push(role === 'admin' ? '/dashboard' : '/customer');
      router.refresh();
    } catch (error) {
      setLoading(false);
      toast({
        variant: 'destructive',
        title: 'Sign-in failed',
        description: error instanceof Error ? error.message : 'Please check your credentials.',
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface font-body">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[10%] top-12 h-24 w-24 rounded-full bg-stitch-primary-fixed/20 blur-3xl" />
        <div className="absolute bottom-[15%] right-[5%] h-40 w-40 rounded-full bg-stitch-secondary-fixed/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-tr from-surface via-surface-container-low to-surface-bright" />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <header className="mb-12 flex flex-col items-center">
          <Logo href="/catalog" imageSize={72} alwaysShowText className="mb-2" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-70">Verified Pharmacy Workspace</p>
        </header>

        {step === 'select' ? (
          <>
            <p className="mb-8 text-center text-on-surface-variant">Choose how you'd like to continue</p>
            <div className="grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
              {/* Customer card */}
              <button
                onClick={() => selectRole('customer')}
                className="group relative overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-stitch-secondary-fixed/50 hover:shadow-2xl active:scale-95"
              >
                <div className="absolute right-0 top-0 p-4 opacity-5 transition-opacity group-hover:opacity-10" aria-hidden>
                  <UserRound className="h-28 w-28 text-stitch-secondary" />
                </div>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-stitch-secondary-container shadow-sm transition-transform group-hover:scale-110">
                  <UserRound className="h-8 w-8 text-stitch-primary" />
                </div>
                <h2 className="font-headline text-2xl font-bold text-stitch-primary">Customer Login</h2>
                <p className="mt-2 max-w-[240px] leading-relaxed text-on-surface-variant">
                  Access prescriptions, orders, and refill tracking in one secure account.
                </p>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-stitch-secondary transition-transform group-hover:translate-x-2">
                  <span>Continue as Patient</span>
                  <span>→</span>
                </div>
              </button>

              {/* Admin card */}
              <button
                onClick={() => selectRole('admin')}
                className="group relative overflow-hidden rounded-xl bg-stitch-primary-container p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-stitch-primary hover:shadow-2xl active:scale-95"
              >
                <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20" aria-hidden>
                  <ShieldCheck className="h-28 w-28 text-white" />
                </div>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-surface-container-lowest shadow-sm transition-transform group-hover:scale-110">
                  <ShieldCheck className="h-8 w-8 text-stitch-primary" />
                </div>
                <h2 className="font-headline text-2xl font-bold text-white">Pharmacist / Admin</h2>
                <p className="mt-2 max-w-[240px] leading-relaxed text-white/80">
                  Manage stock, process prescriptions, and monitor store operations.
                </p>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-stitch-primary-fixed transition-transform group-hover:translate-x-2">
                  <span>Staff Console</span>
                  <span>→</span>
                </div>
              </button>
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
              <Link href="/" className="flex items-center gap-2 rounded-xl px-8 py-3 font-bold text-stitch-primary transition hover:bg-stitch-primary-fixed/10">
                ← Back to Splash
              </Link>
              <p className="text-sm text-on-surface-variant">
                New to Pharma Nest?{' '}
                <Link href="/register" className="font-bold text-stitch-secondary hover:underline">Create Account</Link>
              </p>
            </div>
          </>
        ) : (
          /* Login form */
          <div className="w-full max-w-sm">
            <button
              onClick={() => setStep('select')}
              className="mb-6 flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-stitch-primary"
            >
              ← Back
            </button>
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-lg">
              <div className="mb-6 flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${role === 'admin' ? 'bg-stitch-primary-container text-white' : 'bg-stitch-secondary-container text-stitch-primary'}`}>
                  {role === 'admin' ? <ShieldCheck className="h-6 w-6" /> : <UserRound className="h-6 w-6" />}
                </div>
                <div>
                  <h2 className="font-headline text-xl font-bold text-on-surface">
                    {role === 'admin' ? 'Staff Login' : 'Customer Login'}
                  </h2>
                  <p className="text-xs text-on-surface-variant">Sign in to your account</p>
                </div>
              </div>

              <div className="mb-5 rounded-xl border border-stitch-primary/20 bg-stitch-primary-fixed/15 p-3">
                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-stitch-primary">
                  <KeyRound className="h-3.5 w-3.5" />
                  Demo Access
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => applyDemo(role)}
                    className="rounded-lg border border-stitch-primary/30 bg-white px-3 py-1.5 text-xs font-bold text-stitch-primary transition hover:bg-stitch-primary-fixed/20"
                  >
                    Use {DEMO_CREDENTIALS[role].label}
                  </button>
                  <span className="text-[11px] text-on-surface-variant">
                    {DEMO_CREDENTIALS[role].identifier} / {DEMO_CREDENTIALS[role].password}
                  </span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-on-surface">Email or Username</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin"
                    required
                    className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-sm outline-none transition focus:border-stitch-primary focus:ring-2 focus:ring-stitch-primary/20"
                  />
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-[13px] font-semibold text-on-surface">Password</label>
                    <Link href="/register" className="text-[12px] font-semibold text-stitch-secondary hover:underline">
                      Create account
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 pr-12 text-sm outline-none transition focus:border-stitch-primary focus:ring-2 focus:ring-stitch-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-on-surface-variant transition hover:bg-surface-container"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-gradient flex w-full items-center justify-center gap-2 py-3.5 text-[15px] disabled:opacity-70"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>

              <p className="mt-4 text-center text-[12px] text-on-surface-variant">
                Demo autofill works in development and can be replaced with your own account.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer anchor */}
      <footer className="pointer-events-none fixed bottom-0 w-full p-6 flex justify-between items-end">
        <div className="opacity-30">
          <p className="font-headline text-2xl font-black leading-none text-stitch-primary">PN</p>
          <p className="text-[8px] uppercase tracking-tighter text-on-surface-variant">Licensed Pharmacy Operations</p>
        </div>
      </footer>
    </div>
  );
}
