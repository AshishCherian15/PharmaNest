import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="border-b border-outline-variant/20 bg-surface-container-lowest px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="h-80 rounded-3xl" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
            </div>
          </div>
          <div className="space-y-4 lg:col-span-5">
            <Skeleton className="h-12 w-2/3 rounded-xl" />
            <Skeleton className="h-6 w-1/2 rounded-xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-14 rounded-2xl" />
            <Skeleton className="h-14 rounded-2xl" />
          </div>
        </div>
      </main>
    </div>
  );
}