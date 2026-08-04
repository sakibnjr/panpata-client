"use client";

import Link from "next/link";
import { Phone, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

type Props = {
  agentName: string;
  agentPhone: string | null;
  agentEmail: string;
};

export function AgentSidebarContact({ agentName, agentPhone, agentEmail }: Props) {
  const { user, loading: authLoading } = useAuth();
  const isAuthed = !!user;
  const firstName = agentName.split(" ")[0];

  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-primary">Contact</div>
        <h3 className="mt-1 text-lg font-bold">Get in touch with {firstName}</h3>
        <p className="mt-1 text-sm text-muted-foreground">Typically replies within an hour.</p>

        {isAuthed ? (
          <div className="mt-4 space-y-2">
            {agentPhone && (
              <a
                href={`tel:${agentPhone}`}
                className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm hover:bg-muted/30 transition-colors"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span>{agentPhone}</span>
              </a>
            )}
            <a
              href={`mailto:${agentEmail}`}
              className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm hover:bg-muted/30 transition-colors"
            >
              <Mail className="h-4 w-4 text-primary" />
              <span className="truncate">{agentEmail}</span>
            </a>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed bg-muted/30 p-5 text-center">
            <Lock className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to see {firstName}&apos;s phone and email.
            </p>
            <Link href="/login" className="mt-3 inline-block">
              <Button className="rounded-full" disabled={authLoading}>
                Sign in to view
              </Button>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
