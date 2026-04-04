'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const features = [
  { icon: '💊', text: 'Order prescription medicines online' },
  { icon: '🚚', text: 'Same-day delivery across 50+ cities' },
  { icon: '📋', text: 'Digital prescription management' },
  { icon: '🔒', text: 'Secure & encrypted health data' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? 'Registration failed');
      }
      toast({ title: '🎉 Account created!', description: 'Welcome to Pharma Nest.' });
      router.push('/customer');
      router.refresh();
    } catch (error) {
      setLoading(false);
      toast({ variant: 'destructive', title: 'Registration failed', description: error instanceof Error ? error.message : 'Try again with valid details.' });
    }
  };

  const inputCls = 'w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-sm outline-none transition focus:border-stitch-primary focus:ring-2 focus:ring-stitch-primary/20 placeholder:text-outline';

  return (
    <div className="flex min-h-screen bg-surface font-body">

      {/* ── Left panel — stitch branding ── */}
      <div className="hidden flex-col justify-between px-12 py-16 lg:flex lg:w-5/12 mg-gradient-teal">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image src="/PharmaNest.png" alt="Pharma Nest" width={48} height={48} className="rounded-xl object-contain" />
          <div>
            <p className="font-headline text-2xl font-extrabold text-stitch-primary-fixed">Pharma Nest</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stitch-primary-fixed/50">The Clinical Curator</p>
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-8">
          <div>
            <h1 className="font-headline text-4xl font-extrabold leading-tight text-white">
              Your health journey<br />starts here.
            </h1>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/65">
              Join 2 lakh+ patients who trust Pharma Nest for genuine medicines, fast delivery, and expert pharmacist support.
            </p>
          </div>
          <ul className="space-y-4">
            {features.map((f) => (
              <li key={f.text} className="flex items-center gap-3 text-[13px] text-white/80">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-base">{f.icon}</span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom */}
        <p className="text-[11px] text-white/30">© {new Date().getFullYear()} Pharma Nest · Licensed pharmacy platform</p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <Image src="/PharmaNest.png" alt="Pharma Nest" width={40} height={40} className="rounded-xl object-contain" />
          <span className="font-headline text-2xl font-extrabold text-stitch-primary">Pharma Nest</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-headline text-3xl font-extrabold text-on-surface">Create account</h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-stitch-primary hover:underline">Sign in →</Link>
            </p>
          </div>

          <div className="mb-6 rounded-2xl border border-stitch-secondary-fixed/40 bg-stitch-secondary-fixed/10 p-3 text-xs text-on-surface-variant">
            Public registration creates a <span className="font-bold text-on-surface">Customer</span> account.
            Admin and staff access is provisioned internally.
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-on-surface">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-on-surface">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-on-surface">Phone Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-on-surface">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 5 characters"
                required
                minLength={5}
                className={inputCls}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary-gradient mt-2 flex w-full items-center justify-center gap-2 py-4 text-[15px] disabled:opacity-70"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-[12px] text-on-surface-variant">
            By creating an account, you agree to our{' '}
            <span className="font-semibold text-stitch-primary cursor-pointer hover:underline">Terms of Service</span>
            {' '}and{' '}
            <span className="font-semibold text-stitch-primary cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
