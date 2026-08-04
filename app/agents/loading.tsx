import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function AgentsLoading() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />

      {/* Hero skeleton */}
      <div className="relative h-[50vh] min-h-[360px] w-full bg-muted animate-pulse" />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Title */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Search bar skeleton */}
        <Skeleton className="mb-8 h-24 w-full rounded-xl" />

        {/* Agent card grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-xl border border-border bg-white p-5 shadow-sm">
              <Skeleton className="h-[90px] w-[90px] shrink-0 rounded-full" />
              <div className="flex-1 space-y-2 py-1">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3 w-28" />
                <div className="space-y-1.5 pt-1">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-3 w-36" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
