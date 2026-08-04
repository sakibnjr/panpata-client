import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CarouselRow } from "@/components/site/CarouselRow";
import { PropertyCard } from "@/components/site/PropertyCard";
import { AgentHeaderActions } from "@/components/site/AgentHeaderActions";
import { AgentReviewsSection } from "@/components/site/AgentReviewsSection";
import { AgentSidebarContact } from "@/components/site/AgentSidebarContact";
import { fetchAgentProfile, fetchAgentReviews, type AgentProfile } from "@/lib/agents";
import { mapRow } from "@/lib/properties";
import { Star } from "lucide-react";
import { api } from "@/lib/api-client";
import { getOptimizedImageUrl } from "@/lib/utils";

// Revalidate agent profile pages every 5 minutes (ISR)
export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const agents = await api.get<AgentProfile[]>("/agents");
    // Pre-render top 20 agents at build time. All others generate on-demand on 1st visit & cache!
    return (agents ?? []).slice(0, 20).map((a) => ({ agentId: a.id }));
  } catch {
    return [];
  }
}

type Props = {
  params: Promise<{ agentId: string }>;
};

export default async function AgentDetailPage({ params }: Props) {
  const { agentId } = await params;

  const [agent, reviewsData] = await Promise.all([
    fetchAgentProfile(agentId, { next: { revalidate: 300 } }),
    fetchAgentReviews(agentId, { next: { revalidate: 300 } }),
  ]);

  if (!agent) {
    notFound();
  }

  const agentName = agent.displayName ?? "Unknown Agent";
  const showAvatar = !!agent.avatarUrl;
  const listings = (agent.properties ?? []).slice(0, 6).map(mapRow);
  const avgRating = reviewsData?.meta?.avgRating ?? null;
  const reviewCount = reviewsData?.meta?.count ?? 0;

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
          <Link href="/agents" className="hover:text-primary">
            Agents
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{agentName}</span>
        </nav>

        {/* Profile Card Header */}
        <section className="rounded-2xl border border-border bg-white">
          <div className="flex flex-col gap-6 px-6 py-7 sm:flex-row sm:items-start sm:px-8">
            <div className="shrink-0">
              {showAvatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={getOptimizedImageUrl(agent.avatarUrl)}
                  alt={agentName}
                  className="h-24 w-24 rounded-full object-cover ring-1 ring-border sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted text-foreground text-3xl font-bold ring-1 ring-border sm:h-28 sm:w-28">
                  {agentName[0].toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {agentName}
                </h1>
                <span className="rounded-md border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  Verified
                </span>
              </div>

              {avgRating !== null && (
                <div className="mt-1.5 flex items-center gap-1.5 text-sm">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    · {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                  </span>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="font-semibold text-foreground">
                    {agent._count?.properties ?? 0}
                  </span>
                  <span className="ml-1 text-muted-foreground">
                    listing{(agent._count?.properties ?? 0) !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="h-3.5 w-px bg-border" />
                <div>
                  <span className="font-semibold text-foreground">
                    {reviewCount || "—"}
                  </span>
                  <span className="ml-1 text-muted-foreground">
                    review{reviewCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="h-3.5 w-px bg-border" />
                <div>
                  <span className="text-muted-foreground">Member since </span>
                  <span className="font-semibold text-foreground">
                    {new Date(agent.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
            </div>

            {/* Client Action Buttons */}
            <AgentHeaderActions phone={agent.phone} />
          </div>
        </section>

        {/* Main Section */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {/* About Section */}
            <section>
              <h2 className="text-xl font-bold">About {agentName.split(" ")[0]}</h2>
              <p className="mt-3 leading-relaxed text-foreground/80">
                {agent.bio ??
                  `${agentName} is a verified real estate agent on Panpata with ${
                    agent._count?.properties ?? 0
                  } active listings. Get in touch to discuss your property needs.`}
              </p>
            </section>

            {/* Reviews Section Client Island */}
            <AgentReviewsSection agentId={agent.id} initialReviewsData={reviewsData} />
          </div>

          {/* Contact Sidebar Client Island */}
          <AgentSidebarContact
            agentName={agentName}
            agentPhone={agent.phone}
            agentEmail={agent.email}
          />
        </div>

        <div className="mt-6 border-t" />

        {/* Listings Carousel */}
        {listings.length > 0 && (
          <CarouselRow title={`Listings by ${agentName.split(" ")[0]}`}>
            {listings.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </CarouselRow>
        )}
      </main>

      <Footer />
    </div>
  );
}
