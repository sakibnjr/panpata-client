"use client";

import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { propertyAreas, propertyTypes, type PropertyType } from "@/lib/mock";

export const PRICE_MIN = 0;
export const PRICE_MAX = 60_000_000;
export const SQFT_MIN = 0;
export const SQFT_MAX = 4000;

export function formatPriceShort(n: number) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(0)}L`;
  return `${(n / 1000).toFixed(0)}k`;
}

interface SearchFilterBarProps {
  location: string;
  setLocation: (val: string) => void;
  purpose: string;
  setPurpose: (val: string) => void;
  priceRange: [number, number];
  setPriceRange: (val: [number, number]) => void;
  beds: string;
  setBeds: (val: string) => void;
  baths: string;
  setBaths: (val: string) => void;
  selectedTypes: PropertyType[];
  toggleType: (type: PropertyType) => void;
  selectedAreas: string[];
  toggleArea: (area: string) => void;
  sqftRange: [number, number];
  setSqftRange: (val: [number, number]) => void;
  activeFilterCount: number;
  clearAll: () => void;
  handleSaveSearch: () => void;
  savedSearchAlert: boolean;
}

export function SearchFilterBar({
  location,
  setLocation,
  purpose,
  setPurpose,
  priceRange,
  setPriceRange,
  beds,
  setBeds,
  baths,
  setBaths,
  selectedTypes,
  toggleType,
  selectedAreas,
  toggleArea,
  sqftRange,
  setSqftRange,
  activeFilterCount,
  clearAll,
  handleSaveSearch,
  savedSearchAlert,
}: SearchFilterBarProps) {
  return (
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
              <Label className="text-sm font-semibold text-gray-900">
                Price Range (BDT)
              </Label>
              <Slider
                value={priceRange}
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={500_000}
                onValueChange={(v) =>
                  setPriceRange([v[0], v[1]] as [number, number])
                }
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
                <Label className="text-xs font-semibold text-gray-900">
                  Bedrooms
                </Label>
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
                <Label className="text-xs font-semibold text-gray-900">
                  Bathrooms
                </Label>
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
              {selectedTypes.length === 0
                ? "Home Type"
                : `${selectedTypes.length} Types`}
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-4" align="start">
            <div className="space-y-2.5">
              <Label className="text-xs font-semibold text-gray-900">
                Property Type
              </Label>
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
                <h4 className="text-sm font-bold text-gray-900">
                  More Filters
                </h4>
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
                <Label className="text-xs font-semibold text-gray-900">
                  Neighborhood / Area
                </Label>
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
                <Label className="text-xs font-semibold text-gray-900">
                  Area Size (sqft)
                </Label>
                <Slider
                  value={sqftRange}
                  min={SQFT_MIN}
                  max={SQFT_MAX}
                  step={50}
                  onValueChange={(v) =>
                    setSqftRange([v[0], v[1]] as [number, number])
                  }
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
  );
}
