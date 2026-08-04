"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PropertyCard } from "@/components/site/PropertyCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  propertyAreas,
  propertyTypes,
  formatBDT,
  type PropertyType,
} from "@/lib/mock";
import { fetchProperties } from "@/lib/properties";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, X } from "lucide-react";

const MAX_CARDS = 12;
const PRICE_MIN = 0;
const PRICE_MAX = 60_000_000;
const SQFT_MIN = 0;
const SQFT_MAX = 4000;

function BuyContent() {
  const searchParams = useSearchParams();
  const rawQ = searchParams.get("q") || searchParams.get("area") || "";

  const [prevRawQ, setPrevRawQ] = useState(rawQ);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [userZip, setUserZip] = useState<string | null>(null);

  // Synchronize state when URL search params change during render (no useEffect cascading render)
  if (rawQ !== prevRawQ) {
    setPrevRawQ(rawQ);
    setUserLocation(null);
    setUserZip(null);
  }

  const q = rawQ.trim();
  const isZip = /^\d{4}$/.test(q);
  const location = userLocation !== null ? userLocation : (isZip ? "" : q);
  const zip = userZip !== null ? userZip : (isZip ? q : "");

  const setLocation = (val: string) => setUserLocation(val);
  const setZip = (val: string) => setUserZip(val);

  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [sqftRange, setSqftRange] = useState<[number, number]>([SQFT_MIN, SQFT_MAX]);
  const [beds, setBeds] = useState<string>("any");
  const [baths, setBaths] = useState<string>("any");
  const [selectedTypes, setSelectedTypes] = useState<Set<PropertyType>>(new Set());
  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<string>("featured");

  useEffect(() => {
    if (filtersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [filtersOpen]);

  const { data: properties = [] } = useQuery({
    queryKey: ["properties"],
    queryFn: () => fetchProperties(),
  });

  const filtered = useMemo(() => {
    const loc = location.trim().toLowerCase();
    const zipQ = zip.trim();
    let list = properties.filter((p) => {
      if (loc && !p.address.toLowerCase().includes(loc) && !p.area.toLowerCase().includes(loc)) return false;
      if (zipQ && !p.zip.startsWith(zipQ)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (p.sqft < sqftRange[0] || p.sqft > sqftRange[1]) return false;
      if (beds !== "any" && p.beds < Number(beds)) return false;
      if (baths !== "any" && p.baths < Number(baths)) return false;
      if (selectedTypes.size && !selectedTypes.has(p.type)) return false;
      if (selectedAreas.size && !selectedAreas.has(p.area)) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "sqft-desc") list = [...list].sort((a, b) => b.sqft - a.sqft);
    return list.slice(0, MAX_CARDS);
  }, [properties, location, zip, priceRange, sqftRange, beds, baths, selectedTypes, selectedAreas, sort]);

  function toggle<T>(set: Set<T>, value: T, update: (s: Set<T>) => void) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    update(next);
  }

  function clearAll() {
    setLocation("");
    setZip("");
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setSqftRange([SQFT_MIN, SQFT_MAX]);
    setBeds("any");
    setBaths("any");
    setSelectedTypes(new Set());
    setSelectedAreas(new Set());
  }

  const activeFilterCount =
    (location.trim() ? 1 : 0) +
    (zip.trim() ? 1 : 0) +
    (priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX ? 1 : 0) +
    (sqftRange[0] !== SQFT_MIN || sqftRange[1] !== SQFT_MAX ? 1 : 0) +
    (beds !== "any" ? 1 : 0) +
    (baths !== "any" ? 1 : 0) +
    selectedTypes.size +
    selectedAreas.size;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <nav className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Buy</span>
          </nav>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Homes for sale in Dhaka</h1>
              <p className="mt-1 text-muted-foreground">
                {filtered.length} of {properties.length} listings
                {filtered.length === MAX_CARDS && properties.length > MAX_CARDS && " (showing first 12)"}
              </p>
            </div>
            <button
              id="toggle-filters-btn"
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:border-primary/40 hover:shadow-md active:scale-95"
            >
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              Filters
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> homes
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Sort:</Label>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="sqft-desc">Largest area</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white text-center">
              <p className="text-lg font-semibold">No homes match your filters</p>
              <p className="mt-1 text-sm text-muted-foreground">Try widening your price range or clearing filters.</p>
              <Button onClick={clearAll} className="mt-4 rounded-full">Clear filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <PropertyCard key={p.id} p={p} className="!min-w-0 !max-w-none w-full" />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      <div
        onClick={() => setFiltersOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          backgroundColor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(2px)",
          transition: "opacity 0.3s ease",
          opacity: filtersOpen ? 1 : 0,
          pointerEvents: filtersOpen ? "auto" : "none",
        }}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-label="Property filters"
        aria-modal="true"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          width: "min(360px, 92vw)",
          backgroundColor: "var(--background, #f5f5f5)",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.18)",
          transform: filtersOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.32, 0, 0, 1)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 20px 16px",
            borderBottom: "1px solid var(--border, #e5e7eb)",
            position: "sticky",
            top: 0,
            backgroundColor: "var(--background, #f5f5f5)",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "1rem" }}>
            <SlidersHorizontal style={{ width: 16, height: 16 }} />
            Filters
            {activeFilterCount > 0 && (
              <span
                style={{
                  borderRadius: "9999px",
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                  padding: "1px 8px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAll}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.75rem",
                  color: "var(--muted-foreground)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 6px",
                  borderRadius: "6px",
                }}
              >
                <X style={{ width: 12, height: 12 }} /> Clear all
              </button>
            )}
            <button
              id="close-filters-btn"
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "8px",
                border: "1px solid var(--border, #e5e7eb)",
                background: "white",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>

        <div style={{ padding: "16px 20px 32px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="space-y-3 rounded-xl border border-border bg-white p-4">
            <Label className="text-sm font-semibold">Location</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or area (e.g. Gulshan)"
            />
            <Input
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="Zip code (e.g. 1212)"
              inputMode="numeric"
            />
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-white p-4">
            <Label className="text-sm font-semibold">Price range</Label>
            <Slider
              value={priceRange}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={500_000}
              onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatBDT(priceRange[0])}</span>
              <span>{formatBDT(priceRange[1])}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-white p-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Beds</Label>
              <Select value={beds} onValueChange={setBeds}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}+</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Baths</Label>
              <Select value={baths} onValueChange={setBaths}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {[1, 2, 3, 4].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}+</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-white p-4">
            <Label className="text-sm font-semibold">Area (sqft)</Label>
            <Slider
              value={sqftRange}
              min={SQFT_MIN}
              max={SQFT_MAX}
              step={50}
              onValueChange={(v) => setSqftRange([v[0], v[1]] as [number, number])}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{sqftRange[0].toLocaleString()} sqft</span>
              <span>{sqftRange[1].toLocaleString()} sqft</span>
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-border bg-white p-4">
            <Label className="text-sm font-semibold">Property type</Label>
            <div className="space-y-1.5">
              {propertyTypes.map((t) => (
                <label key={t} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedTypes.has(t)}
                    onCheckedChange={() => toggle(selectedTypes, t, setSelectedTypes)}
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-border bg-white p-4">
            <Label className="text-sm font-semibold">Area</Label>
            <div className="space-y-1.5">
              {propertyAreas.map((a) => (
                <label key={a} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedAreas.has(a)}
                    onCheckedChange={() => toggle(selectedAreas, a, setSelectedAreas)}
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            position: "sticky",
            bottom: 0,
            padding: "14px 20px",
            borderTop: "1px solid var(--border, #e5e7eb)",
            backgroundColor: "var(--background, #f5f5f5)",
          }}
        >
          <button
            onClick={() => setFiltersOpen(false)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "12px",
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              fontWeight: 600,
              fontSize: "0.9rem",
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.15s",
            }}
          >
            Show {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </button>
        </div>
      </aside>
    </div>
  );
}

export default function BuyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <BuyContent />
    </Suspense>
  );
}
