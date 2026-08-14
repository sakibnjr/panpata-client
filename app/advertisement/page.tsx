import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AdHeroSection } from "@/components/advertisement/AdHeroSection";
import { AdWhyAdvertise } from "@/components/advertisement/AdWhyAdvertise";
import { AdPricingPlans } from "@/components/advertisement/AdPricingPlans";
import { AdGetStartedAndReviews } from "@/components/advertisement/AdGetStartedAndReviews";
import { AdBottomCta } from "@/components/advertisement/AdBottomCta";

export default function AdvertisementPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">
        <AdHeroSection />
        <AdWhyAdvertise />
        <AdPricingPlans />
        <AdGetStartedAndReviews />
        <AdBottomCta />
      </main>

      <Footer />
    </div>
  );
}
