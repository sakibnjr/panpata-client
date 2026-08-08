import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CarouselRow } from "@/components/site/CarouselRow";
import { PropertyCard } from "@/components/site/PropertyCard";
import { PropertySidebar } from "@/components/site/PropertySidebar";
import { formatBDT } from "@/lib/mock";
import { getOptimizedImageUrl } from "@/lib/utils";
import { fetchProperty, fetchProperties, daysSince } from "@/lib/properties";
import {
  Maximize,
  MapPin,
  Calendar,
  Home as HomeIcon,
  CheckCircle2,
  Eye,
  Clock,
} from "lucide-react";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const properties = await fetchProperties();
    // Only pre-render top 20 properties at build time to keep builds fast.
    // All other 1000+ properties generate on-demand on first visit & cache automatically!
    return properties.slice(0, 20).map((p) => ({ propertyId: p.id }));
  } catch {
    return [];
  }
}

type Props = {
  params: Promise<{ propertyId: string }>;
};

export default async function PropertyDetailPage({ params }: Props) {
  const { propertyId } = await params;

  const [p, all] = await Promise.all([
    fetchProperty(propertyId, { next: { revalidate: 60 } }),
    fetchProperties(undefined, { next: { revalidate: 60 } }),
  ]);

  if (!p) {
    notFound();
  }

  const agent = p.agent ?? null;
  const agentName = agent?.displayName ?? "Unknown Agent";
  const agentPhone = agent?.phone ?? "";
  const others = all.filter((x) => x.id !== p.id);
  const gallery = p.images && p.images.length > 0 ? p.images : [p.image];
  const related = others.slice(0, 6);
  const posted = daysSince(p.createdAt);
  const postedLabel = posted === 0 ? "today" : posted === 1 ? "1 day ago" : `${posted} days ago`;
  const areaName = p.address.split(",").slice(-2)[0]?.trim();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/buy" className="hover:text-primary">
            Dhaka
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{p.address.split(",")[0]}</span>
        </nav>

        {/* Image gallery grid */}
        <section className="grid grid-cols-1 gap-2 overflow-hidden rounded-2xl md:grid-cols-4 md:grid-rows-2">
          <div className="md:col-span-2 md:row-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getOptimizedImageUrl(gallery[0])}
              alt={p.address}
              className="h-full max-h-[520px] w-full object-cover"
            />
          </div>
          {gallery.slice(1, 5).map((g, i) => (
            <div key={i} className="hidden md:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getOptimizedImageUrl(g)}
                alt={`Gallery ${i + 2}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          {gallery.length < 5 &&
            Array.from({ length: 5 - Math.max(gallery.length, 1) }).map((_, i) => (
              <div key={`placeholder-${i}`} className="hidden md:block bg-muted/40" />
            ))}
        </section>

        {/* Agent mini banner */}
        {agent && (
          <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm">
            <div className="flex items-center gap-3">
              {agent.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={getOptimizedImageUrl(agent.avatarUrl)}
                  alt={agentName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {agentName[0].toUpperCase()}
                </div>
              )}
              <span className="font-bold text-foreground">{agentName}</span>
              <span className="text-muted-foreground">Panpata Agent</span>
            </div>
            <span className="text-muted-foreground">→</span>
          </div>
        )}

        {/* Pricing and Stats */}
        <section className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            {p.tag && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white ${
                  p.tagColor === "orange" ? "bg-orange-500" : "bg-primary"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white" /> {p.tag}
              </span>
            )}
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight">{formatBDT(p.price)}</h1>
            <p className="mt-1 text-muted-foreground">{p.address}</p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span className="font-semibold text-foreground">
                  {p.views.toLocaleString()}
                </span>{" "}
                views
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Posted {postedLabel}
              </span>
            </div>
          </div>
          <div className="flex items-end gap-8">
            <Stat value={p.beds} label="beds" />
            <Stat value={p.baths} label="baths" />
            <Stat value={p.sqft.toLocaleString()} label="sqft" />
          </div>
        </section>

        {/* Estimated payment bar */}
        <div className="mt-4 inline-flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-sm">
          <span className="text-foreground">
            Est. payment:{" "}
            <span className="font-bold">{formatBDT(Math.round(p.price / 240))}/mo</span>
          </span>
          <a href="#prequalify" className="font-semibold text-primary hover:underline">
            Get pre-qualified
          </a>
        </div>

        {/* Feature pills */}
        <section className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Pill icon={HomeIcon} label={`${p.beds}-bed residence`} />
          <Pill icon={Calendar} label="Built 2022" />
          <Pill icon={CheckCircle2} label={p.status} />
          <Pill
            icon={Maximize}
            label={`${p.sqft > 0 ? Math.round(p.price / p.sqft).toLocaleString() : "—"} ৳/sqft`}
          />
          <Pill icon={MapPin} label={areaName ?? "Dhaka"} />
        </section>

        <div className="mt-8 border-t" />

        {/* Main Grid: Details + PropertySidebar Island */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section>
              <h2 className="text-2xl font-bold">What&apos;s special</h2>
              <p className="mt-3 leading-relaxed text-foreground/80">
                {p.description ??
                  `A beautifully designed ${p.beds}-bedroom residence located in ${
                    p.address.split(",")[1]?.trim() ?? "Dhaka"
                  }.
                  Thoughtful layout, premium finishes, and abundant natural light make this ${p.sqft.toLocaleString()} sqft home an exceptional
                  opportunity. Walking distance to schools, restaurants and major transit, with secure parking and modern building amenities.`}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold">Features</h2>
              {p.features && p.features.length > 0 ? (
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground italic">
                  No features listed for this property.
                </p>
              )}
            </section>

            <section>
              <h2 className="text-xl font-bold">Location</h2>
              <div className="mt-3 flex h-64 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 text-muted-foreground">
                <div className="text-center">
                  <MapPin className="mx-auto h-8 w-8 text-primary" />
                  <p className="mt-2 text-sm">Map preview · {p.address}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Client Island Sidebar */}
          <PropertySidebar
            propertyId={p.id}
            propertyAddress={p.address}
            agentId={p.agentId ?? null}
            agentName={agentName}
            agentPhone={agentPhone}
            agentAvatarUrl={agent?.avatarUrl}
            area={areaName}
          />
        </div>

        <div className="mt-6 border-t" />

        <CarouselRow title="Similar homes nearby">
          {related.map((r) => (
            <PropertyCard key={r.id} p={r} />
          ))}
        </CarouselRow>
      </main>

      <Footer />
    </div>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-extrabold leading-none">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Pill({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2.5 text-sm">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-foreground/80">{label}</span>
    </div>
  );
}
