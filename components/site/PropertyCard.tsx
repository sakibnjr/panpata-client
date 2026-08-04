import Link from "next/link";
import { cn, getOptimizedImageUrl } from "@/lib/utils";
import { formatBDT, type Property } from "@/lib/mock";

export function PropertyCard({ p, className }: { p: Property; className?: string }) {
  const tagBg = p.tagColor === "brand" ? "bg-primary" : "bg-orange-500";
  return (
    <Link
      href={`/property/${p.id}`}
      className={cn(
        "group block overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:shadow-lg",
        "min-w-[340px] max-w-[360px] flex-shrink-0 snap-start",
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getOptimizedImageUrl(p.image)}
          alt={p.address}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {p.tag && (
          <span className={`absolute left-3 top-3 rounded-md ${tagBg} px-2.5 py-1 text-xs font-semibold text-white shadow`}>
            {p.tag}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="text-xl font-bold text-foreground">{formatBDT(p.price)}</div>
        <div className="mt-1 text-sm text-foreground/80">
          <span className="font-semibold">{p.beds}</span> bds <span className="text-muted-foreground">|</span>{" "}
          <span className="font-semibold">{p.baths}</span> ba <span className="text-muted-foreground">|</span>{" "}
          <span className="font-semibold">{p.sqft.toLocaleString()}</span> sqft <span className="text-muted-foreground">|</span>{" "}
          <span>{p.status}</span>
        </div>
        <p className="mt-1 truncate text-sm text-muted-foreground">{p.address}</p>
      </div>
    </Link>
  );
}
