"use client";

import Image from "next/image";
import buyIllustration from "@/public/assets/buy page illustration.png";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { PropertyCard } from "@/components/site/PropertyCard";
import { PropertyCardSkeleton } from "@/components/site/Skeletons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { propertyAreas, propertyTypes, type PropertyType } from "@/lib/mock";
import { fetchProperties } from "@/lib/properties";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

const MAX_CARDS = 12;
const PRICE_MIN = 0;
const PRICE_MAX = 60_000_000;
const SQFT_MIN = 0;
const SQFT_MAX = 4000;

function formatPriceShort(n: number) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(0)}L`;
  return `${(n / 1000).toFixed(0)}k`;
}

function BuyContent() {
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

  const [purpose, setPurpose] = useState<string>("for-sale");
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [sqftRange, setSqftRange] = useState<[number, number]>([SQFT_MIN, SQFT_MAX]);
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
      if (loc && !p.address.toLowerCase().includes(loc) && !p.area.toLowerCase().includes(loc))
        return false;
      if (zipQ && !p.zip.startsWith(zipQ)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (p.sqft < sqftRange[0] || p.sqft > sqftRange[1]) return false;
      if (beds !== "any" && p.beds < Number(beds)) return false;
      if (baths !== "any" && p.baths < Number(baths)) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(p.type)) return false;
      if (selectedAreas.length > 0 && !selectedAreas.includes(p.area)) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
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
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  function toggleArea(area: string) {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  }

  function clearAll() {
    setLocation("");
    setZip("");
    setPurpose("for-sale");
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
    (purpose !== "for-sale" ? 1 : 0) +
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

      {/* Hero Banner Header */}
      <section className="border-b border-gray-100 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <div className="max-w-2xl text-center sm:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Find Homes for Sale Near You
            </h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Browse verified listings, high-quality photos, open house schedules, and detailed
              property information.
            </p>
          </div>
          <div className="flex shrink-0 items-center justify-center">
            <Image
              src={buyIllustration}
              alt="Find homes illustration"
              className="h-28 sm:h-36 w-auto object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Top Inline Filter Bar */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Pill Input */}
          <div className="min-w-[260px] flex-1 sm:min-w-[320px]">
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Address, neighborhood, city or zip code"
              className="h-10 rounded-full border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-500 shadow-sm focus-visible:ring-emerald-600"
            />
          </div>

          {/* For Sale Dropdown */}
          <Select value={purpose} onValueChange={setPurpose}>
            <SelectTrigger className="h-10 w-[115px] rounded-full border-gray-300 bg-white text-xs font-semibold text-gray-800 shadow-sm focus:ring-emerald-600">
              <SelectValue placeholder="For sale" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="for-sale">For sale</SelectItem>
              <SelectItem value="for-rent">For rent</SelectItem>
              <SelectItem value="land-share">Land share</SelectItem>
            </SelectContent>
          </Select>

          {/* Price Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-10 rounded-full border-gray-300 bg-white text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-50 gap-1.5 px-4"
              >
                {priceRange[0] === PRICE_MIN && priceRange[1] === PRICE_MAX
                  ? "Price"
                  : `BDT ${formatPriceShort(priceRange[0])} - ${formatPriceShort(priceRange[1])}`}
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900">Price Range (BDT)</Label>
                <Slider
                  value={priceRange}
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={500_000}
                  onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
                />
                <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                  <span>BDT {priceRange[0].toLocaleString()}</span>
                  <span>BDT {priceRange[1].toLocaleString()}</span>
                </div>
                <div className="flex justify-end pt-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-gray-500 hover:text-gray-900"
                    onClick={() => setPriceRange([PRICE_MIN, PRICE_MAX])}
                  >
                    Reset price
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Beds / Baths Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-10 rounded-full border-gray-300 bg-white text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-50 gap-1.5 px-4"
              >
                {beds === "any" && baths === "any"
                  ? "Beds/Baths"
                  : `${beds !== "any" ? `${beds}+ beds` : ""}${baths !== "any" ? ` ${baths}+ baths` : ""}`}
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4" align="start">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-900">Bedrooms</Label>
                  <div className="flex gap-1">
                    {["any", "1", "2", "3", "4", "5"].map((num) => (
                      <button
                        key={num}
                        onClick={() => setBeds(num)}
                        className={`flex-1 rounded-md py-1.5 text-xs font-semibold border transition ${
                          beds === num
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {num === "any" ? "Any" : `${num}+`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-900">Bathrooms</Label>
                  <div className="flex gap-1">
                    {["any", "1", "2", "3", "4"].map((num) => (
                      <button
                        key={num}
                        onClick={() => setBaths(num)}
                        className={`flex-1 rounded-md py-1.5 text-xs font-semibold border transition ${
                          baths === num
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {num === "any" ? "Any" : `${num}+`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Home Type Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-10 rounded-full border-gray-300 bg-white text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-50 gap-1.5 px-4"
              >
                {selectedTypes.length === 0 ? "Home Type" : `${selectedTypes.length} Types`}
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4" align="start">
              <div className="space-y-2.5">
                <Label className="text-xs font-semibold text-gray-900">Property Type</Label>
                {propertyTypes.map((t) => (
                  <label
                    key={t}
                    className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700"
                  >
                    <Checkbox
                      checked={selectedTypes.includes(t)}
                      onCheckedChange={() => toggleType(t)}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Filters Popover / Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-10 rounded-full border-gray-300 bg-white text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-50 gap-1.5 px-4"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-gray-600" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-sm font-bold text-gray-900">More Filters</h4>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-xs font-medium text-emerald-600 hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-900">Neighborhood / Area</Label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {propertyAreas.map((a) => (
                      <label
                        key={a}
                        className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-700"
                      >
                        <Checkbox
                          checked={selectedAreas.includes(a)}
                          onCheckedChange={() => toggleArea(a)}
                        />
                        {a}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-900">Area Size (sqft)</Label>
                  <Slider
                    value={sqftRange}
                    min={SQFT_MIN}
                    max={SQFT_MAX}
                    step={50}
                    onValueChange={(v) => setSqftRange([v[0], v[1]] as [number, number])}
                  />
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>{sqftRange[0]} sqft</span>
                    <span>{sqftRange[1]} sqft</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Save Search Button */}
          <Button
            onClick={handleSaveSearch}
            className="h-10 rounded-full bg-[#00c853] hover:bg-[#00b248] text-white text-xs font-bold px-5 shadow-sm transition-all active:scale-95 ml-auto sm:ml-0"
          >
            Save Search
          </Button>

          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 px-2"
            >
              <X className="h-3.5 w-3.5" /> Clear filters
            </button>
          )}
        </div>

        {savedSearchAlert && (
          <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs font-medium text-emerald-800 transition-all">
            ✓ Your search criteria has been saved to your account notifications.
          </div>
        )}
      </section>

      {/* Main Results Section */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Results Header */}
        <div className="mb-6 flex flex-col justify-between gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Real Estate & Homes For Sale
            </h2>
            <p className="mt-1 text-sm font-bold text-gray-800">
              {filtered.length.toLocaleString()} results
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600">Sort:</span>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-9 w-[180px] rounded-lg border-gray-200 bg-white text-xs font-medium text-gray-800 shadow-sm focus:ring-emerald-600">
                <SelectValue placeholder="Homes for You" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Homes for You</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="sqft-desc">Largest area</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 4-Column Property Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-center p-6">
            <p className="text-base font-bold text-gray-900">
              No homes match your search or filters
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Try adjusting location, price range, or property type.
            </p>
            <Button
              onClick={clearAll}
              className="mt-4 rounded-full bg-emerald-600 text-white text-xs font-semibold px-5"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <PropertyCard key={p.id} p={p} className="w-full" />
            ))}
          </div>
        )}
      </main>

      <Footer />
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
