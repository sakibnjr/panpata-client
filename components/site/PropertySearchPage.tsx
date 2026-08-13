"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import type { PropertyType } from "@/lib/mock";
import { fetchProperties } from "@/lib/properties";
import { SearchHeroBanner } from "./property-search/SearchHeroBanner";
import {
  SearchFilterBar,
  PRICE_MIN,
  PRICE_MAX,
  SQFT_MIN,
  SQFT_MAX,
} from "./property-search/SearchFilterBar";
import { SearchResultsHeader } from "./property-search/SearchResultsHeader";
import { SearchResultsGrid } from "./property-search/SearchResultsGrid";

const MAX_CARDS = 12;

interface PropertySearchPageProps {
  title: string;
  description?: string;
  defaultPurpose?: string;
}

function SearchContent({
  title,
  description = "Browse verified listings, high-quality photos, open house schedules, and detailed property information.",
  defaultPurpose = "for-sale",
}: PropertySearchPageProps) {
  const searchParams = useSearchParams();
  const rawQ = searchParams.get("q") || searchParams.get("area") || "";

  const [prevRawQ, setPrevRawQ] = useState(rawQ);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [userZip, setUserZip] = useState<string | null>(null);

  if (rawQ !== prevRawQ) {
    setPrevRawQ(rawQ);
    setUserLocation(null);
    setUserZip(null);
  }

  const q = rawQ.trim();
  const isZip = /^\d{4}$/.test(q);
  const location = userLocation !== null ? userLocation : isZip ? "" : q;
  const zip = userZip !== null ? userZip : isZip ? q : "";

  const setLocation = (val: string) => setUserLocation(val);
  const setZip = (val: string) => setUserZip(val);

  const [purpose, setPurpose] = useState<string>(defaultPurpose);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    PRICE_MIN,
    PRICE_MAX,
  ]);
  const [sqftRange, setSqftRange] = useState<[number, number]>([
    SQFT_MIN,
    SQFT_MAX,
  ]);
  const [beds, setBeds] = useState<string>("any");
  const [baths, setBaths] = useState<string>("any");
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [sort, setSort] = useState<string>("featured");
  const [savedSearchAlert, setSavedSearchAlert] = useState(false);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: () => fetchProperties(),
  });

  const filtered = useMemo(() => {
    const loc = location.trim().toLowerCase();
    const zipQ = zip.trim();
    let list = properties.filter((p) => {
      if (purpose === "land-share" && p.type !== "Land") return false;
      if (
        loc &&
        !p.address.toLowerCase().includes(loc) &&
        !p.area.toLowerCase().includes(loc)
      )
        return false;
      if (zipQ && !p.zip.startsWith(zipQ)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (p.sqft < sqftRange[0] || p.sqft > sqftRange[1]) return false;
      if (beds !== "any" && p.beds < Number(beds)) return false;
      if (baths !== "any" && p.baths < Number(baths)) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(p.type))
        return false;
      if (selectedAreas.length > 0 && !selectedAreas.includes(p.area))
        return false;
      return true;
    });
    if (sort === "price-asc")
      list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "sqft-desc") list = [...list].sort((a, b) => b.sqft - a.sqft);
    return list.slice(0, MAX_CARDS);
  }, [
    properties,
    purpose,
    location,
    zip,
    priceRange,
    sqftRange,
    beds,
    baths,
    selectedTypes,
    selectedAreas,
    sort,
  ]);

  function toggleType(type: PropertyType) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }

  function toggleArea(area: string) {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  }

  function clearAll() {
    setLocation("");
    setZip("");
    setPurpose(defaultPurpose);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setSqftRange([SQFT_MIN, SQFT_MAX]);
    setBeds("any");
    setBaths("any");
    setSelectedTypes([]);
    setSelectedAreas([]);
  }

  const activeFilterCount =
    (location.trim() ? 1 : 0) +
    (zip.trim() ? 1 : 0) +
    (purpose !== defaultPurpose ? 1 : 0) +
    (priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX ? 1 : 0) +
    (sqftRange[0] !== SQFT_MIN || sqftRange[1] !== SQFT_MAX ? 1 : 0) +
    (beds !== "any" ? 1 : 0) +
    (baths !== "any" ? 1 : 0) +
    selectedTypes.length +
    selectedAreas.length;

  const handleSaveSearch = () => {
    setSavedSearchAlert(true);
    setTimeout(() => setSavedSearchAlert(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <SearchHeroBanner title={title} description={description} />

      <SearchFilterBar
        location={location}
        setLocation={setLocation}
        purpose={purpose}
        setPurpose={setPurpose}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        beds={beds}
        setBeds={setBeds}
        baths={baths}
        setBaths={setBaths}
        selectedTypes={selectedTypes}
        toggleType={toggleType}
        selectedAreas={selectedAreas}
        toggleArea={toggleArea}
        sqftRange={sqftRange}
        setSqftRange={setSqftRange}
        activeFilterCount={activeFilterCount}
        clearAll={clearAll}
        handleSaveSearch={handleSaveSearch}
        savedSearchAlert={savedSearchAlert}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <SearchResultsHeader
          count={filtered.length}
          sort={sort}
          setSort={setSort}
        />

        <SearchResultsGrid
          isLoading={isLoading}
          filtered={filtered}
          clearAll={clearAll}
        />
      </main>

      <Footer />
    </div>
  );
}

export function PropertySearchPage(props: PropertySearchPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SearchContent {...props} />
    </Suspense>
  );
}
