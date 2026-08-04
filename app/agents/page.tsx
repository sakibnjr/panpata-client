import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AgentsGrid } from "@/components/site/AgentsGrid";
import { api } from "@/lib/api-client";
import type { AgentProfile } from "@/lib/agents";

export const metadata = {
  title: "Find a Real Estate Agent | Panpata",
  description:
    "Connect with verified real estate agents across Dhaka. Browse agent profiles, listings, and reviews.",
};

// Agents list changes rarely — revalidate every 5 minutes
export const revalidate = 300;

export default async function AgentsPage() {
  // Fetch agents on the server — zero client JS for the initial data load
  let agents: AgentProfile[] = [];
  try {
    agents = await api.get<AgentProfile[]>("/agents", {
      next: { revalidate: 300 },
    });
  } catch {
    // Fall back to empty; AgentsGrid shows "no agents" state
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />

      {/* Hero banner — static, fully server-rendered */}
      <section className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/agents-hero.webp"
          alt="Real estate agent with clients"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 text-center sm:px-10">
          <h1 className="text-3xl font-extrabold leading-tight text-white drop-shadow-md sm:text-4xl md:text-[2.6rem]">
            A great agent makes<br />all the difference
          </h1>
        </div>
      </section>

      {/* AgentsGrid = client island: owns the search bar + filter + results */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Real Estate Agents in Dhaka
          </h2>
          <p className="mt-2 mx-auto max-w-xl text-sm text-muted-foreground">
            With experienced agents across all top areas, a local expert knows your market and can
            guide you through the process from start to finish.
          </p>
        </div>

        <AgentsGrid agents={agents} />
      </main>

      <Footer />
    </div>
  );
}
