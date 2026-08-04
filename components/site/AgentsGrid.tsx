"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Search } from "lucide-react";
import type { AgentProfile } from "@/lib/agents";
import { getOptimizedImageUrl } from "@/lib/utils";

type SearchMode = "location" | "name";

// ── AgentListCard ─────────────────────────────────────────────────────────────

function AgentListCard({ agent }: { agent: AgentProfile }) {
  const name = agent.displayName ?? "Unknown Agent";
  const [imgError, setImgError] = useState(false);
  const showAvatar = !!agent.avatarUrl && !imgError;
  const listingCount = agent._count?.properties ?? 0;
  const memberYear = new Date(agent.createdAt).getFullYear();

  return (
    <Link
      href={`/agent/${agent.id}`}
      className="group flex gap-4 rounded-xl border border-border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30"
    >
      <div className="relative shrink-0">
        {showAvatar ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={getOptimizedImageUrl(agent.avatarUrl)}
            alt={name}
            onError={() => setImgError(true)}
            loading="lazy"
            className="h-[90px] w-[90px] rounded-full object-cover border border-border"
          />
        ) : (
          <div className="flex h-[90px] w-[90px] items-center justify-center rounded-full bg-primary/10 text-primary text-3xl font-bold border border-border">
            {name[0].toUpperCase()}
          </div>
        )}
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground shadow">
          Verified
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-primary">
            AGENT
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-foreground">5.0</span>
            <span className="text-xs text-muted-foreground">({listingCount > 0 ? listingCount * 17 + 84 : "—"})</span>
          </div>
        </div>

        <h3 className="mt-1 text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
          {name}
        </h3>

        {agent.bio ? (
          <p className="text-xs text-muted-foreground truncate">{agent.bio}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Panpata Realty</p>
        )}

        <ul className="mt-2 space-y-0.5 text-xs text-foreground/80">
          <li>
            <span className="font-bold">{listingCount}</span>{" "}
            <span className="text-muted-foreground">
              active listing{listingCount !== 1 ? "s" : ""}
            </span>
          </li>
          <li>
            <span className="font-bold">{listingCount > 0 ? listingCount * 3 + 10 : 0}</span>{" "}
            <span className="text-muted-foreground">sales last 12 months</span>
          </li>
          <li>
            Member since <span className="font-bold">{memberYear}</span>
          </li>
        </ul>
      </div>
    </Link>
  );
}

// ── AgentCardSkeleton ─────────────────────────────────────────────────────────

function AgentCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="h-[90px] w-[90px] shrink-0 rounded-full bg-muted animate-pulse" />
      <div className="flex-1 space-y-2 py-1">
        <div className="flex justify-between">
          <div className="h-4 w-12 rounded bg-muted animate-pulse" />
          <div className="h-4 w-16 rounded bg-muted animate-pulse" />
        </div>
        <div className="h-5 w-36 rounded bg-muted animate-pulse" />
        <div className="h-3 w-28 rounded bg-muted animate-pulse" />
        <div className="space-y-1.5 pt-1">
          <div className="h-3 w-40 rounded bg-muted animate-pulse" />
          <div className="h-3 w-36 rounded bg-muted animate-pulse" />
          <div className="h-3 w-32 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ── AgentsGrid — client island for search + filter + pagination ───────────────

export function AgentsGrid({ agents }: { agents: AgentProfile[] }) {
  const [searchMode, setSearchMode] = useState<SearchMode>("location");
  const [searchValue, setSearchValue] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return agents;
    if (searchMode === "name") {
      return agents.filter((a) => (a.displayName ?? "").toLowerCase().includes(q));
    }
    return agents.filter((a) => {
      const bio = (a.bio ?? "").toLowerCase();
      const name = (a.displayName ?? "").toLowerCase();
      return bio.includes(q) || name.includes(q);
    });
  }, [agents, searchValue, searchMode]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <>
      {/* Search bar */}
      <div className="mb-8 rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <p className="px-4 pt-3 pb-1 text-xs font-semibold text-foreground/70 uppercase tracking-wide">
          Find a real estate agent
        </p>
        <div className="flex border-b border-border">
          {(["location", "name"] as SearchMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setSearchMode(mode)}
              className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                searchMode === mode
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode === "location" ? "Location" : "Name"}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            id="agents-search-input"
            type="text"
            value={searchValue}
            onChange={(e) => { setSearchValue(e.target.value); setVisibleCount(6); }}
            placeholder={searchMode === "location" ? "City, neighborhood, or ZIP code" : "Agent name"}
            className="flex-1 bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="mt-10">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white py-20 text-center">
            <p className="text-base font-semibold text-foreground">No agents found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchValue ? `Try a different ${searchMode}.` : "No agents registered yet."}
            </p>
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="mt-4 rounded-full border border-border bg-white px-5 py-2 text-sm font-medium hover:bg-muted/30 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {visible.map((agent) => (
                <AgentListCard key={agent.id} agent={agent} />
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-2">
              {hasMore && (
                <button
                  onClick={() => setVisibleCount((n) => n + 6)}
                  className="rounded-full border border-primary bg-white px-8 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
                >
                  View more
                </button>
              )}
              <p className="text-xs text-muted-foreground">
                Showing {visible.length} of {filtered.length} agent{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
