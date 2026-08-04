import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AgentProfileSkeleton } from "@/components/site/Skeletons";

export default function AgentDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AgentProfileSkeleton />
      <Footer />
    </div>
  );
}
