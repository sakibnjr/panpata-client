import Link from "next/link";
import { cn, getOptimizedImageUrl } from "@/lib/utils";
import { formatBDT, type Property } from "@/lib/mock";

type LandProperty = Property & {
  katha?: number;
  units?: number;
  propertyId?: string;
  company?: string;
  agentName?: string;
};

export function LandShareCard({
  p,
  className,
}: {
  p: LandProperty;
  className?: string;
}) {
  const katha = p.katha ?? 8.125;
  const units = p.units ?? 40;
  const propId = p.propertyId ?? `#${p.id.padStart(8, "0")}`;
  const company = p.company ?? "VisionEra Ltd";
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
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="text-xl font-bold text-foreground">{formatBDT(p.price)}</div>

        {/* Katha / Units / Sqft / Status */}
        <div className="mt-1 text-sm text-foreground/80">
          <span className="font-semibold">{katha}</span> katha{" "}
          <span className="text-muted-foreground">|</span>{" "}
          <span className="font-semibold">{units}</span> units{" "}
          <span className="text-muted-foreground">|</span>{" "}
          <span className="font-semibold">{p.sqft.toLocaleString()}</span> sqft{" "}
          <span className="text-muted-foreground">|</span>{" "}
          <span>{p.status.toLowerCase()}</span>
        </div>

        {/* Address */}
        <p className="mt-1 truncate text-sm text-muted-foreground">{p.address}</p>

        {/* Property Id, Company, Agent */}
        <p className="mt-1 truncate text-xs text-muted-foreground">
          Property Id {propId},{company}
        </p>
        <p className="truncate text-xs text-muted-foreground">{agentName}</p>
      </div>
    </Link>
  );
}
