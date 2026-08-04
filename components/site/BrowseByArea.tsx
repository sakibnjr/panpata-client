import Link from "next/link";
import { MapPin } from "lucide-react";

const AREAS = [
  "Rampura",
  "Motijheel",
  "Wari",
  "Dhanmondi",
  "Mohammadpur",
  "Mirpur",
  "Uttara",
  "Banani",
  "Shahbagh",
  "Kafrul",
  "Kotwali",
  "Lalbagh",
  "Dhamrai",
  "Badda",
  "Savar",
  "Keraniganj",
  "Sabujbagh",
  "Nawabganj",
  "Dohar",
];

export function BrowseByArea() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          Browse the{" "}
          <span className="text-primary">newest</span>{" "}
          homes from around the Dhaka
        </h2>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {AREAS.map((area) => (
            <Link
              key={area}
              href={`/buy?q=${encodeURIComponent(area)}`}
              className="flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-sm text-foreground shadow-sm transition hover:border-primary hover:text-primary hover:shadow-md"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {area}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
