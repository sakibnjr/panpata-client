import { categories } from "@/lib/mock";
import { getOptimizedImageUrl } from "@/lib/utils";

export function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h2 className="mb-5 text-xl font-bold text-foreground sm:text-2xl">Categories we offer</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {categories.map((c) => (
          <a
            key={c.id}
            href={`#category-${c.id}`}
            className="group relative aspect-[3/2] overflow-hidden rounded-lg shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getOptimizedImageUrl(c.image)}
              alt={c.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-white drop-shadow">
              {c.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
