import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero skeleton */}
        <div className="relative h-[50vh] min-h-[360px] w-full bg-muted animate-pulse" />

        {/* Carousel skeleton */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="mb-4 flex items-end justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[340px] max-w-[360px] flex-shrink-0 overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BentoCTAs skeleton */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
