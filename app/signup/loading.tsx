import { Header } from "@/components/site/Header";
import { Skeleton } from "@/components/ui/skeleton";

export default function SignupLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto flex max-w-sm flex-col px-4 py-16">
        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm space-y-5">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56" />
          <div className="space-y-3 pt-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <Skeleton className="h-4 w-44" />
        </div>
      </main>
    </div>
  );
}
