import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AdBottomCta() {
  return (
    <section className="pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[22px] bg-[#00c068] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-left shadow-lg shadow-[#00c068]/20">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Start your property’s journey today
            </h3>
            <p className="text-xs sm:text-sm text-white/90 font-normal">
              Reach thousands of potential buyers and get quality leads with Panpata.
            </p>
          </div>

          <Link
            href="/talk-to-agent"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#00c068] shadow-sm transition hover:bg-gray-50 active:scale-98"
          >
            <span>Advertise Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
