import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-10 text-center shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-stitch-secondary">404</p>
        <h1 className="mt-3 font-headline text-4xl font-extrabold text-on-surface">Page not found</h1>
        <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
          The page you requested does not exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="btn-primary-gradient px-6 py-3 text-sm">
            Back to Home
          </Link>
          <Link href="/catalog" className="rounded-xl border border-outline-variant/30 px-6 py-3 text-sm font-bold text-on-surface transition hover:bg-surface-container-low">
            Browse Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}