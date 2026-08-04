import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PropertyDetailSkeleton } from "@/components/site/Skeletons";

export default function PropertyLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PropertyDetailSkeleton />
      <Footer />
    </div>
  );
}
