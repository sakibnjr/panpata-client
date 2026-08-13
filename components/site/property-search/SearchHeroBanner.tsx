import Image from "next/image";
import buyIllustration from "@/public/assets/buy page illustration.png";

interface SearchHeroBannerProps {
  title: string;
  description: string;
}

export function SearchHeroBanner({ title, description }: SearchHeroBannerProps) {
  return (
    <section className="border-b border-gray-100 bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
        <div className="max-w-2xl text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            {description}
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
  );
}
