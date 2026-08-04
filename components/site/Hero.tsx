"use client";

import { Search, MapPin, X, Loader2, Clock } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchAreaSuggestions, type AreaSuggestion } from "@/lib/properties";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const LS_KEY = "panpata_recent_searches";
const MAX_RECENT = 5;

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(term: string, current: string[]): string[] {
  const deduped = [term, ...current.filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(
    0,
    MAX_RECENT,
  );
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(deduped));
  } catch {
    /* silent */
  }
  return deduped;
}

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AreaSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [open, setOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentSearches(loadRecent());
  }, []);

  const debouncedQuery = useDebounce(query, 280);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetchAreaSuggestions(debouncedQuery).then((results) => {
      if (cancelled) return;
      setSuggestions(results);
      setHighlightIdx(-1);
      setOpen(results.length > 0);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const showSpinner = loading || (query.trim().length > 0 && query !== debouncedQuery);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const doSearch = useCallback(
    (term: string) => {
      if (!term.trim()) return;
      setOpen(false);
      setRecentSearches((prev) => saveRecent(term.trim(), prev));
      router.push(`/buy?q=${encodeURIComponent(term.trim())}`);
    },
    [router],
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === "Enter") doSearch(query);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIdx >= 0 && suggestions[highlightIdx]) {
        const s = suggestions[highlightIdx];
        const term = /^\d+$/.test(query.trim()) ? s.zip : s.area;
        setQuery(term);
        doSearch(term);
      } else {
        doSearch(query);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function pickSuggestion(s: AreaSuggestion) {
    const term = /^\d+$/.test(query.trim()) ? s.zip : s.area;
    setQuery(term);
    doSearch(term);
    inputRef.current?.focus();
  }

  function clearRecent() {
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      /* silent */
    }
    setRecentSearches([]);
  }

  return (
    <section className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/hero.webp"
        alt="Modern home in Dhaka at sunset"
        width={1920}
        height={1024}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      <div className="relative mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-4 text-left text-white sm:px-6">
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight drop-shadow-md sm:text-5xl md:text-6xl">
          Panpata Early Access. <br /> Find it first.
        </h1>

        {/* Search container */}
        <div ref={containerRef} className="relative mt-8 w-full max-w-xl">
          <div className="flex w-full items-center overflow-hidden rounded-full bg-white shadow-2xl">
            <input
              ref={inputRef}
              id="hero-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) setOpen(true);
              }}
              placeholder="Enter Your address, neighborhood, city or zip code "
              autoComplete="off"
              aria-label="Search properties by area or zip code"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls="hero-search-listbox"
              className="flex-1 bg-transparent px-6 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {showSpinner ? (
              <span className="mr-2 flex h-8 w-8 items-center justify-center text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
              </span>
            ) : query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  setOpen(false);
                  inputRef.current?.focus();
                }}
                className="mr-1 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
            <button
              type="button"
              aria-label="Search"
              onClick={() => doSearch(query)}
              className="m-1.5 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {open && suggestions.length > 0 && (
            <ul
              id="hero-search-listbox"
              ref={listRef}
              role="listbox"
              aria-label="Area suggestions"
              className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl bg-white shadow-2xl border border-border animate-in fade-in-0 slide-in-from-top-2 duration-150"
            >
              {suggestions.map((s, i) => (
                <li
                  key={`${s.area}-${s.zip}`}
                  role="option"
                  aria-selected={i === highlightIdx}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pickSuggestion(s)}
                  onMouseEnter={() => setHighlightIdx(i)}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors ${
                    i === highlightIdx ? "bg-accent" : "hover:bg-accent/50"
                  } ${i !== suggestions.length - 1 ? "border-b border-border/50" : ""}`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{s.area}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      Dhaka · ZIP {s.zip} ·{" "}
                      <span className="font-medium text-primary">
                        {s.count} {s.count === 1 ? "listing" : "listings"}
                      </span>
                    </p>
                  </div>
                  <span className="ml-auto shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
                    {s.zip}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {open === false &&
            !showSpinner &&
            query.trim().length > 1 &&
            debouncedQuery === query &&
            suggestions.length === 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl bg-white shadow-2xl border border-border px-5 py-4 text-sm text-muted-foreground">
                No listings found for{" "}
                <span className="font-semibold text-foreground">&quot;{query}&quot;</span> — try a
                different area or zip code.
              </div>
            )}
        </div>

        {recentSearches.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Clock className="h-3.5 w-3.5 shrink-0 text-white/50" />
            {recentSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => doSearch(term)}
                className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-colors"
              >
                {term}
              </button>
            ))}
            <button
              type="button"
              onClick={clearRecent}
              aria-label="Clear recent searches"
              className="ml-1 text-white/40 hover:text-white/70 transition-colors text-xs"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
