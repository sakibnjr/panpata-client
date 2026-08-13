"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchResultsHeaderProps {
  count: number;
  sort: string;
  setSort: (val: string) => void;
}

export function SearchResultsHeader({
  count,
  sort,
  setSort,
}: SearchResultsHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-end">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          Real Estate & Homes For Sale
        </h2>
        <p className="mt-1 text-sm font-bold text-gray-800">
          {count.toLocaleString()} results
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
  );
}
