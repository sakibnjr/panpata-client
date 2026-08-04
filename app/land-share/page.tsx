import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Layers } from "lucide-react";

export default function LandSharePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-white shadow-sm">
          <Layers className="h-7 w-7 text-primary" />
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Land Share Project
        </h1>

        <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
          A new way to co-own land in Bangladesh. We&apos;re building a platform for transparent,
          community-driven land investments — launching soon.
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Coming soon
        </div>

        <Link
          href="/"
          className="mt-8 text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          ← Back to home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
