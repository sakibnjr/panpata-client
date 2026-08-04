import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { CarouselRow } from "@/components/site/CarouselRow";
import { PropertyCard } from "@/components/site/PropertyCard";
import { FeaturedPropertyCard } from "@/components/site/FeaturedPropertyCard";
import { LandShareCard } from "@/components/site/LandShareCard";
import { BentoCTAs } from "@/components/site/BentoCTAs";
import { TalkToAgent } from "@/components/site/TalkToAgent";
import { BrowseByArea } from "@/components/site/BrowseByArea";
import { Footer } from "@/components/site/Footer";
import { fetchProperties } from "@/lib/properties";

// Revalidate the home page every 60 seconds (ISR)
// — serves cached HTML instantly, refreshes in the background when stale.
export const revalidate = 60;

export default async function HomePage() {
  // Fetch once on the server — no client JS needed
  const properties = await fetchProperties(
    undefined,
    { next: { revalidate: 60 } },
  );

  const featuredProperties = properties.filter(
    (p) => p.type === "House" || p.type === "Apartment",
  );

  const landProperties =
    properties.filter((p) => p.type === "Land").length > 0
      ? properties.filter((p) => p.type === "Land")
      : properties;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />

        <CarouselRow title="Homes for you" subtitle="Based on homes you recently viewed">
          {properties.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </CarouselRow>

        <BentoCTAs />

        <CarouselRow
          title="Featured real estate in Dhaka"
          subtitle="Based on homes you recently viewed"
        >
          {featuredProperties.map((p) => (
            <FeaturedPropertyCard key={p.id} p={p} />
          ))}
        </CarouselRow>

        <CarouselRow
          title="Land share project in Dhaka"
          subtitle="Based on homes you recently viewed"
        >
          {landProperties.map((p) => (
            <LandShareCard key={p.id} p={p} />
          ))}
        </CarouselRow>

        <TalkToAgent />
        <BrowseByArea />
      </main>
      <Footer />
    </div>
  );
}
