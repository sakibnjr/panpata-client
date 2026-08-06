import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {
  return (
    <div className="min-w-[340px] max-w-[360px] flex-shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}

export function BuyPageCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <Skeleton className="h-[220px] w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-52" />
        <Skeleton className="h-4 w-44" />
        <Skeleton className="mt-2 h-3 w-24" />
      </div>
    </div>
  );
}

export function AgentCardSkeleton() {
  return (
    <div className="flex min-w-[320px] max-w-[340px] flex-shrink-0 snap-start gap-4 rounded-xl border border-border bg-white p-4 shadow-sm">
      <Skeleton className="h-24 w-24 flex-shrink-0 rounded-full" />
      <div className="flex-1 space-y-2 pt-1">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-28" />
        <div className="space-y-1.5 pt-1">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}

export function PropertyDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 pt-6 sm:px-6">
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-2" />
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-2" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 gap-2 overflow-hidden rounded-2xl md:grid-cols-4 md:grid-rows-2">
        <Skeleton className="md:col-span-2 md:row-span-2 h-[260px] md:h-[520px] rounded-none" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="hidden md:block h-[128px] rounded-none" />
        ))}
      </div>

      <Skeleton className="mt-6 h-14 w-full rounded-xl" />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-4 w-72" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="flex gap-8">
          {["beds", "baths", "sqft"].map((s) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <Skeleton className="h-8 w-10" />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="mt-4 h-9 w-64 rounded-lg" />

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 rounded-lg" />
        ))}
      </div>

      <div className="mt-8 h-px bg-border" />

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="space-y-3">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-28" />
            <div className="grid gap-2 sm:grid-cols-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-4">
            <Skeleton className="h-3 w-16" />
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </div>
      </div>

      <div className="mt-6 h-px bg-border" />

      <section className="py-10">
        <div className="mb-4 flex items-end justify-between">
          <Skeleton className="h-7 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function AgentProfileSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 pt-6 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-2" />
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-2" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Header Profile Card */}
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Skeleton className="h-24 w-24 shrink-0 rounded-full sm:h-28 sm:w-28" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-44" />
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-4 pt-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* About Section */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          {/* Reviews Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-5 w-28" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-white p-6 space-y-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-36" />
            <div className="flex flex-col items-center gap-3 pt-2">
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </aside>
      </div>

      <div className="mt-8 h-px bg-border" />

      {/* Listings Carousel Skeleton */}
      <section className="py-10">
        <div className="mb-4 flex items-end justify-between">
          <Skeleton className="h-7 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function SidebarAuthSkeleton() {
  return <Skeleton className="mt-4 h-10 w-full rounded-md" />;
}
