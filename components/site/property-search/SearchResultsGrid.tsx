import { PropertyCard } from "@/components/site/PropertyCard";
import { BuyPageCardSkeleton } from "@/components/site/Skeletons";
import { Button } from "@/components/ui/button";
import type { Property } from "@/lib/mock";

interface SearchResultsGridProps {
  isLoading: boolean;
  filtered: Property[];
  clearAll: () => void;
}

export function SearchResultsGrid({
  isLoading,
  filtered,
  clearAll,
}: SearchResultsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <BuyPageCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filtered.map((p) => (
        <PropertyCard
          key={p.id}
          p={p}
          className="!w-full !min-w-0 !max-w-none"
        />
      ))}
    </div>
  );
}
