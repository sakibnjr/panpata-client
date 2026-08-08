"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, User } from "lucide-react";
import type { AgentProfile } from "@/lib/agents";
import { getOptimizedImageUrl } from "@/lib/utils";

export function AgentsGrid({
  initialAgents = [],
}: {
  initialAgents?: AgentProfile[];
}) {
  const [locationQuery, setLocationQuery] = useState("");
  const [nameQuery, setNameQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter agents directly from backend data
  const filtered = useMemo(() => {
    const loc = locationQuery.trim().toLowerCase();
    const name = nameQuery.trim().toLowerCase();

    return (initialAgents || []).filter((agent) => {
      const bio = (agent.bio ?? "").toLowerCase();
      const displayName = (agent.displayName ?? "").toLowerCase();
      const email = (agent.email ?? "").toLowerCase();

      const matchLoc = !loc || bio.includes(loc) || displayName.includes(loc);
      const matchName = !name || displayName.includes(name) || email.includes(name);

      return matchLoc && matchName;
    });
  }, [initialAgents, locationQuery, nameQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const visibleAgents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setCurrentPage(1);
  }

  return (
    <>
      {/* Search Bar Container */}
      <form
        onSubmit={handleSearch}
        className="mb-10 sm:mb-12 flex flex-col sm:flex-row items-center justify-start gap-3 w-full"
      >
        {/* Location Input */}
        <input
          type="text"
          value={locationQuery}
          onChange={(e) => {
            setLocationQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Address, neighborhood, city or zip code"
          className="w-full sm:flex-1 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm text-slate-800 placeholder:text-gray-400 shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />

        {/* Agent Name Input */}
        <input
          type="text"
          value={nameQuery}
          onChange={(e) => {
            setNameQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Agent name"
          className="w-full sm:flex-1 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm text-slate-800 placeholder:text-gray-400 shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />

        {/* Find Agent Button */}
        <button
          type="submit"
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-[#00c853] hover:bg-[#00b248] active:scale-95 text-white font-medium px-6 py-3 text-sm transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
        >
          <Search className="h-4 w-4" />
          <span>Find agent</span>
        </button>
      </form>

      {/* Results Counter */}
      <div className="mb-6 px-0">
        <p className="text-sm font-normal text-slate-700">
          {filtered.length} agent{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Agent Cards Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-slate-50 py-16 text-center">
          <p className="text-base font-semibold text-slate-800">No agents found</p>
          <p className="mt-1 text-sm text-slate-500">
            {locationQuery || nameQuery
              ? "Try adjusting your location or agent name filter."
              : "No agents registered in the database yet."}
          </p>
          {(locationQuery || nameQuery) && (
            <button
              onClick={() => {
                setLocationQuery("");
                setNameQuery("");
                setCurrentPage(1);
              }}
              className="mt-4 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleAgents.map((agent) => (
            <NewAgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}

      {/* ── Pagination Controls ────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="mt-12 mb-16 flex items-center justify-center gap-3.5 text-sm font-medium">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:border-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-3">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
              const isActive = currentPage === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCurrentPage(num)}
                  className={`relative px-1 py-0.5 text-sm transition-colors ${
                    isActive
                      ? "font-bold text-slate-900 border-b-2 border-slate-900"
                      : "font-normal text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:border-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Why Choose a agent Section ──────────────────────────────────────── */}
      <section className="mt-12 pt-10 pb-16 bg-[#fafafa]/80 rounded-3xl px-6 sm:px-10 border border-gray-100/80">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-10 text-center sm:text-left">
          Why Choose <span className="text-[#00c853]">a agent</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Feature Card 1 */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100/90 transition-all hover:shadow-md">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 border border-slate-100 p-2 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/bento-agent.webp"
                alt="Local expert"
                className="h-full w-full object-contain"
              />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Connect with a local expert
            </h3>
            <p className="mt-2.5 text-xs text-slate-500 leading-relaxed max-w-xs">
              Work with experienced local agents dedicated to achieving the best results.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100/90 transition-all hover:shadow-md">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 border border-slate-100 p-2 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/bento-buy.webp"
                alt="Lower commission rates"
                className="h-full w-full object-contain"
              />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Lower commission rates
            </h3>
            <p className="mt-2.5 text-xs text-slate-500 leading-relaxed max-w-xs">
              Buy or sell your property with us and save more with our competitive commission rates.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100/90 transition-all hover:shadow-md">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 border border-slate-100 p-2 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/buy page illustration.png"
                alt="Connect with more buyers"
                className="h-full w-full object-contain"
              />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Connect with more buyers
            </h3>
            <p className="mt-2.5 text-xs text-slate-500 leading-relaxed max-w-xs">
              Reach more buyers and sellers with a platform built for maximum exposure.
            </p>
          </div>
        </div>
      </section>

      {/* ── Frequently Asked Questions Section ─────────────────────────────── */}
      <section className="mt-16 mb-20 max-w-4xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#00c853] text-center mb-10">
          Frequently asked questions
        </h2>

        <FaqAccordion />
      </section>
    </>
  );
}

// ─── FAQ Accordion Component ──────────────────────────────────────────────────

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How to find good real estate agent near me?",
      a: "You can search by location, neighborhood, or ZIP code on Panpata to browse top-rated local real estate agents operating directly in your area.",
    },
    {
      q: "How to pick a real estate agent?",
      a: "Look for agents with high deal volume, strong client reviews, and deep expertise in your target neighborhood or specific property type.",
    },
    {
      q: "How to contact a real estate agent?",
      a: "Click the 'Contact' button on any agent card or profile page to send a direct message, email, or request a call back.",
    },
  ];

  return (
    <div className="space-y-0">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border-b border-slate-900">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between py-5 text-left transition-colors group cursor-pointer"
            >
              <span className="text-sm sm:text-base font-medium text-slate-900 group-hover:text-[#00c853] transition-colors">
                {faq.q}
              </span>
              <ChevronRight
                className={`h-4 w-4 text-slate-900 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-90 text-[#00c853]" : ""
                }`}
              />
            </button>
            {isOpen && (
              <p className="pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                {faq.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── New Agent Card Component rendering real backend data ──────────────────────

function NewAgentCard({ agent }: { agent: AgentProfile }) {
  const [imgError, setImgError] = useState(false);
  const displayName = agent.displayName ?? "Verified Agent";
  const subtitle = agent.bio ? agent.bio : "Agent . Dhaka";
  const totalDeals = agent._count?.properties ?? 0;
  const avatar = agent.avatarUrl ? getOptimizedImageUrl(agent.avatarUrl) : null;
  const showAvatar = !!avatar && !imgError;

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.06)] hover:shadow-lg transition-all duration-300">
      {/* Top Agent Image */}
      <div className="relative h-64 sm:h-60 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
        {showAvatar ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={avatar}
            alt={displayName}
            onError={() => setImgError(true)}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 object-center"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-emerald-50/60 text-emerald-600">
            <User className="h-16 w-16 stroke-[1.5]" />
          </div>
        )}
      </div>

      {/* Card Details Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Agent Display Name */}
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {displayName}
          </h3>

          {/* Agent Role / Location */}
          <p className="mt-1 text-xs text-slate-500 font-normal line-clamp-1">
            {subtitle}
          </p>

          {/* Total Deals */}
          <p className="mt-2.5 text-xs text-slate-900 font-semibold">
            Total deals . {totalDeals}
          </p>

          {/* Email */}
          <p className="mt-1 text-xs text-[#00c853] font-medium truncate">
            {agent.email}
          </p>
        </div>

        {/* Contact Button */}
        <Link
          href={`/agent/${agent.id}`}
          className="mt-5 block w-full rounded-full border border-slate-300 py-2.5 px-4 text-center text-xs sm:text-sm font-medium text-slate-800 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
        >
          Contact
        </Link>
      </div>
    </div>
  );
}
