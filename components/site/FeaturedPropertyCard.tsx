"use client";

import Link from "next/link";
import { Star, Bookmark } from "lucide-react";
import { cn, getOptimizedImageUrl } from "@/lib/utils";
import { formatBDT, type Property } from "@/lib/mock";

type ExtendedProperty = Property & {
  propertyId?: string;
  agency?: string;
  agentName?: string;
};

export function FeaturedPropertyCard({
  p,
  className,
}: {
  p: ExtendedProperty;
  className?: string;
}) {
  const agency = p.agency ?? "";
  const agentName = p.agentName ?? "Agent";

  return (
    <Link
      href={`/property/${p.id}`}
      className={cn(
        "group block overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:shadow-lg",
        "min-w-[300px] max-w-[320px] flex-shrink-0 snap-start",
        className,
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getOptimizedImageUrl(p.image)}
          alt={p.address}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {/* Top-left: star */}
        <button
          aria-label="Save to favourites"
          onClick={(e) => e.preventDefault()}
          className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
        >
          <Star className="h-4 w-4" />
        </button>
        {/* Top-right: bookmark */}
        <button
          aria-label="Bookmark property"
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
        >
          <Bookmark className="h-4 w-4" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="text-xl font-bold text-foreground">{formatBDT(p.price)}</div>

        {/* Beds / Baths / Sqft / Status */}
        <div className="mt-1 text-sm text-foreground/80">
          <span className="font-semibold">{p.beds}</span>bds{" "}
          <span className="text-muted-foreground">|</span>{" "}
          <span className="font-semibold">{p.baths}</span>ba{" "}
          <span className="text-muted-foreground">|</span>{" "}
          <span className="font-semibold">{p.sqft.toLocaleString()}</span> sqft{" "}
          <span className="text-muted-foreground">|</span> <span>{p.status}</span>
        </div>

        {/* Address */}
        <p className="mt-1 truncate text-sm text-muted-foreground">{p.address}</p>

        {/* Agency & Agent */}
        <p className="mt-1 truncate text-xs text-muted-foreground">{agency}</p>
        <p className="truncate text-xs text-muted-foreground">{agentName}</p>
      </div>
    </Link>
  );
}
