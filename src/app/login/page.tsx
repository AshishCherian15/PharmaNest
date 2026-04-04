'use client';

import type { AuthRole } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [role, setRole] = useState<AuthRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const selectRole = (r: AuthRole) => {
    setRole(r);
    setEmail('');
    setPassword('');
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
          <div className="flex items-center gap-4">
            <Image src="/PharmaNest.png" alt="Pharma Nest" width={64} height={64} className="rounded-xl object-contain" />
            <div>
              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-stitch-primary">Pharma Nest</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-70">The Clinical Curator</p>
            </div>
          </div>
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
                <div className="absolute right-0 top-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
                  <span className="text-[160px] leading-none">👤</span>
                </div>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-stitch-secondary-container text-3xl shadow-sm transition-transform group-hover:scale-110">
                  👤
                </div>
                <h2 className="font-headline text-2xl font-bold text-stitch-primary">Customer Login</h2>
                <p className="mt-2 max-w-[240px] leading-relaxed text-on-surface-variant">
                  Access your prescriptions, order history, and health tracking tools.
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
                <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                  <span className="text-[160px] leading-none text-white">🏪</span>
                </div>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-surface-container-lowest text-3xl shadow-sm transition-transform group-hover:scale-110">
                  🏪
                </div>
                <h2 className="font-headline text-2xl font-bold text-white">Pharmacist / Admin</h2>
                <p className="mt-2 max-w-[240px] leading-relaxed text-white/80">
                  Manage inventory, process orders, and generate operational reports.
                </p>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-stitch-primary-fixed transition-transform group-hover:translate-x-2">
                  <span>Staff Console</span>
                  <span>⚙️</span>
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
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${role === 'admin' ? 'bg-stitch-primary-container' : 'bg-stitch-secondary-container'}`}>
                  {role === 'admin' ? '🏪' : '👤'}
                </div>
                <div>
                  <h2 className="font-headline text-xl font-bold text-on-surface">
                    {role === 'admin' ? 'Staff Login' : 'Customer Login'}
                  </h2>
                  <p className="text-xs text-on-surface-variant">Sign in to your account</p>
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
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-sm outline-none transition focus:border-stitch-primary focus:ring-2 focus:ring-stitch-primary/20"
                  />
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
                Use your registered account credentials to continue.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer anchor */}
      <footer className="pointer-events-none fixed bottom-0 w-full p-6 flex justify-between items-end">
        <div className="opacity-30">
          <p className="font-headline text-2xl font-black leading-none text-stitch-primary">PN</p>
          <p className="text-[8px] uppercase tracking-tighter text-on-surface-variant">Pharma Operations v4.2</p>
        </div>
      </footer>
    </div>
  );
}
