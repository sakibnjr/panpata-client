import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AgentsGrid } from "@/components/site/AgentsGrid";
import { api } from "@/lib/api-client";
import type { AgentProfile } from "@/lib/agents";

export const metadata = {
  title: "Find the most experienced real estate agents in Dhaka | Panpata",
  description:
    "Connect with verified real estate agents across Dhaka. Browse agent profiles, listings, and total deals.",
};

// Agents list changes rarely — revalidate every 5 minutes
export const revalidate = 300;

export default async function AgentsPage() {
  let agents: AgentProfile[] = [];
  try {
    agents = await api.get<AgentProfile[]>("/agents", {
      next: { revalidate: 300 },
    });
  } catch {
    // Fall back to empty; AgentsGrid handles mock fallback gracefully
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pt-12 pb-12 sm:px-6 sm:pt-14 sm:pb-16 lg:px-8">
        {/* Page Title */}
        <h1 className="text-left text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-[2.25rem] mt-2 mb-6">
          Find the most experienced real estate agents in Dhaka
        </h1>

        {/* AgentsGrid client component with search & 4-column card grid */}
        <AgentsGrid initialAgents={agents} />
      </main>

      <Footer />
    </div>
  );
}
