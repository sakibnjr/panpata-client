"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { tokenStore } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { reloadUser } = useAuth();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = searchParams.get("token");
    const refresh = searchParams.get("refresh");

    if (!token || !refresh) {
      toast.error("Google sign-in failed. Please try again.");
      router.push("/login");
      return;
    }

    tokenStore.set(token, refresh);

    reloadUser()
      .then(() => {
        toast.success("Welcome! You're signed in with Google.");
        router.push("/");
      })
      .catch(() => {
        tokenStore.clear();
        toast.error("Could not load your account. Please try again.");
        router.push("/login");
      });
  }, [router, searchParams, reloadUser]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          Completing sign-in…
        </p>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CallbackContent />
    </Suspense>
  );
}
