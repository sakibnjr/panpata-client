"use client";

import { useState } from "react";
import Link from "next/link";
import type { AgentProfile } from "@/lib/agents";
import { getOptimizedImageUrl } from "@/lib/utils";

export function AgentCard({ a }: { a: AgentProfile }) {
  const name = a.displayName ?? "Unknown Agent";
  const [imgError, setImgError] = useState(false);
  const showAvatar = !!a.avatarUrl && !imgError;

  return (
    <Link
      href={`/agent/${a.id}`}
      className="flex min-w-[320px] max-w-[340px] flex-shrink-0 snap-start gap-4 rounded-xl border border-border bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-24 w-24 flex-shrink-0">
        {showAvatar ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={getOptimizedImageUrl(a.avatarUrl)}
            alt={name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-24 w-24 rounded-full border-2 border-white object-cover shadow"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-white bg-primary/10 text-primary text-3xl font-bold shadow">
            {name[0].toUpperCase()}
          </div>
        )}
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-primary shadow ring-1 ring-border">
          Verified
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-primary">
          AGENT
        </div>
        <h3 className="mt-1 truncate text-base font-bold text-foreground">{name}</h3>
        {a.bio && <p className="truncate text-sm text-muted-foreground">{a.bio}</p>}
        <ul className="mt-2 space-y-0.5 text-xs text-foreground/80">
          <li><span className="font-bold">{a._count?.properties ?? 0}</span> active listings</li>
          <li>Member since <span className="font-bold">{new Date(a.createdAt).getFullYear()}</span></li>
          {a.phone && <li><span className="font-bold">{a.phone}</span></li>}
        </ul>
      </div>
    </Link>
  );
}
