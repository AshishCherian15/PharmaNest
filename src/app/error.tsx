'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-8 text-center shadow-xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-2xl">
          !
        </div>
        <h1 className="font-headline text-3xl font-extrabold text-on-surface">Something went wrong</h1>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
          The page hit an unexpected error. You can retry or return to the home page.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-5 overflow-auto rounded-2xl bg-surface-container-low p-4 text-left text-xs text-error">
            {error.message}
          </pre>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={reset} className="btn-primary-gradient flex-1 px-5 py-3 text-sm">
            Try Again
          </button>
          <Link href="/" className="flex-1 rounded-xl border border-outline-variant/30 px-5 py-3 text-sm font-bold text-on-surface transition hover:bg-surface-container-low">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}