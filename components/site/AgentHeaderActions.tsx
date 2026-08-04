"use client";

import Link from "next/link";
import { Mail, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

type Props = {
  phone?: string | null;
};

export function AgentHeaderActions({ phone }: Props) {
  const { user, loading: authLoading } = useAuth();
  const isAuthed = !!user;

  if (isAuthed) {
    return (
      <div className="flex shrink-0 items-start gap-2 sm:pt-1">
        <Button variant="outline" size="sm" className="rounded-full">
          <Mail className="mr-1.5 h-3.5 w-3.5" /> Message
        </Button>
        {phone && (
          <Button size="sm" className="rounded-full">
            <Phone className="mr-1.5 h-3.5 w-3.5" /> Call
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-start gap-2 sm:pt-1">
      <Link href="/login">
        <Button size="sm" className="rounded-full" disabled={authLoading}>
          <Lock className="mr-1.5 h-3.5 w-3.5" /> Sign in to contact
        </Button>
      </Link>
    </div>
  );
}
