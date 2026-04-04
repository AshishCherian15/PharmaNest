import { cookies } from 'next/headers';
import { AUTH_COOKIE, parseSessionToken } from '@/lib/auth';
import Link from 'next/link';

export default async function CustomerProfilePage() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);

  const initials = session?.name
    ? session.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-2xl font-extrabold text-on-surface">My Profile</h1>

      {/* Avatar + name card */}
      <div className="mg-gradient relative overflow-hidden rounded-2xl p-8">
        <div className="absolute right-0 top-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-stitch-primary-fixed/10 blur-3xl" />
        <div className="relative z-10 flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-stitch-primary-fixed text-3xl font-extrabold text-stitch-primary shadow-lg">
            {initials}
          </div>
          <div>
            <h2 className="font-headline text-2xl font-bold text-white">{session?.name ?? 'Customer'}</h2>
            <p className="text-sm text-white/70">{session?.email ?? 'No email'}</p>
            <span className="mt-2 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold capitalize text-stitch-primary-fixed">
              {session?.role ?? 'customer'}
            </span>
          </div>
        </div>
      </div>

      {/* Account details */}
      <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
        <h3 className="font-headline mb-5 text-base font-bold text-on-surface">Account Details</h3>
        <div className="space-y-4">
          {[
            { label: 'Full Name', value: session?.name ?? 'N/A', icon: '👤' },
            { label: 'Email Address', value: session?.email ?? 'N/A', icon: '📧' },
            { label: 'Account Type', value: session?.role ?? 'N/A', icon: '🏷️' },
            { label: 'Account ID', value: session?.id ?? 'N/A', icon: '🔑' },
          ].map((field) => (
            <div key={field.label} className="flex items-center gap-4 rounded-xl bg-surface-container-low px-4 py-3">
              <span className="text-xl">{field.icon}</span>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{field.label}</p>
                <p className="mt-0.5 font-semibold text-on-surface capitalize">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
          <h3 className="font-headline mb-2 font-bold text-on-surface">Security</h3>
          <p className="mb-4 text-sm text-on-surface-variant">Update your password and security settings.</p>
          <button className="rounded-xl border border-stitch-primary px-4 py-2 text-sm font-bold text-stitch-primary transition hover:bg-stitch-primary-fixed/10">
            Change Password
          </button>
        </div>
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
          <h3 className="font-headline mb-2 font-bold text-on-surface">Notifications</h3>
          <p className="mb-4 text-sm text-on-surface-variant">Manage your email and SMS preferences.</p>
          <button className="rounded-xl border border-stitch-primary px-4 py-2 text-sm font-bold text-stitch-primary transition hover:bg-stitch-primary-fixed/10">
            Manage Alerts
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <h3 className="font-headline mb-1 font-bold text-red-800">Danger Zone</h3>
        <p className="mb-4 text-sm text-red-700">Permanently delete your account and all associated data.</p>
        <button className="rounded-xl border border-red-400 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100">
          Delete Account
        </button>
      </div>
    </div>
  );
}
