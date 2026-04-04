import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-10 w-96" />
      </div>
      <div className="grid gap-12 lg:grid-cols-12">
        <Skeleton className="aspect-[4/3] rounded-3xl lg:col-span-7" />
        <div className="space-y-4 lg:col-span-5">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-12 rounded-2xl" />
          <Skeleton className="h-12 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}