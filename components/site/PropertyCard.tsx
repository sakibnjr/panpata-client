import Link from "next/link";
import { cn, getOptimizedImageUrl } from "@/lib/utils";
import { type Property } from "@/lib/mock";

export function PropertyCard({ p, className }: { p: Property; className?: string }) {
  const agencyOrOwner = p.agent?.displayName || p.ownerName || null;

  return (
    <Link
      href={`/property/${p.id}`}
      className={cn(
        "group block w-[340px] min-w-[340px] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-[4/3] h-[220px] w-full overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getOptimizedImageUrl(p.image)}
          alt={p.address}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {p.tag && (
          <span
            className={cn(
              "absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold text-white shadow",
              p.tagColor === "brand" ? "bg-primary" : "bg-orange-500",
            )}
          >
            {p.tag}
          </span>
        )}

        {/* Carousel pagination dots at bottom center */}
        <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1 z-10">
          <span className="h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/60 shadow-sm" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/60 shadow-sm" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/60 shadow-sm" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/60 shadow-sm" />
        </div>
      </div>

      <div className="flex h-[155px] flex-col justify-between p-4 bg-white">
        <div>
          <div className="text-lg font-bold text-gray-900 tracking-tight">
            BDT {p.price.toLocaleString("en-US")}
          </div>

          <div className="mt-1 text-xs font-medium text-gray-700 leading-snug">
            <span className="font-bold">{p.beds}</span>bds |{" "}
            <span className="font-bold">{p.baths}</span>ba |{" "}
            <span className="font-bold">{p.sqft.toLocaleString("en-US")}</span> sqft |{" "}
            <span className="text-gray-600">
              {p.type === "House" ? "House for sale" : `${p.type} for sale`}
            </span>
          </div>

          <p className="mt-2 text-xs text-gray-600 line-clamp-2 leading-relaxed min-h-[32px]">
            {p.address}
          </p>
        </div>

        <div className="mt-2 text-[11px] text-gray-500 font-medium truncate min-h-[16px]">
          {agencyOrOwner ?? ""}
        </div>
      </div>
    </Link>
  );
}
