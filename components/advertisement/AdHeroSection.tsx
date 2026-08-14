import Link from "next/link";
import { Award, ChevronRight, ArrowRight } from "lucide-react";

// 8-point green star icon matching the screenshot
const GreenStarIcon = () => (
  <svg
    className="h-3.5 w-3.5 shrink-0 text-[#0ca678]"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 0l2.5 8.5L23 11l-8.5 2.5L12 22l-2.5-8.5L1 11l8.5-2.5z" />
  </svg>
);

export function AdHeroSection() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 items-center justify-items-center gap-10 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Heading, Subtitle, Features & Button */}
          <div className="w-full max-w-md lg:col-span-5 lg:max-w-none text-left space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-gray-900 leading-[1.2]">
                Connect Your Property
                <span className="block text-[#0ca678]">
                  with the Right People
                </span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed max-w-sm">
                Advertise on Panpata and Get More Views, Inquiries &amp; Leads.
              </p>
            </div>

            {/* Bullet points */}
            <div className="space-y-2.5 pt-1">
              {[
                "More Views",
                "Targeted Buyers",
                "Smart Lead Management",
                "Performance Tracking",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <GreenStarIcon />
                  <span className="text-sm font-medium text-gray-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Link
                href="/talk-to-agent"
                className="inline-flex items-center gap-2 rounded-full bg-[#0ca678] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#0ca678]/25 transition hover:bg-[#099268] hover:shadow-lg active:scale-98"
              >
                <span>Advertise Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Group: 2 Floating Cards (Center + Right) */}
          <div className="w-full lg:col-span-7">
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-6 lg:gap-8">
              
              {/* --- Center Card: Featured Ad Preview --- */}
              <div className="w-full max-w-[305px] flex flex-col justify-between rounded-[32px] border border-gray-100 bg-white p-4 shadow-[0_30px_70px_rgba(0,0,0,0.15)] transition-transform duration-200 hover:-translate-y-1.5 min-h-[435px]">
                <div>
                  {/* Property Image Container */}
                  <div className="relative aspect-[4/3.1] w-full overflow-hidden rounded-[22px] bg-gray-100 shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80"
                      alt="Featured property"
                      className="h-full w-full object-cover"
                    />

                    {/* Featured Ads Badge */}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-[#0ca678] px-3 py-1 text-[11px] font-semibold text-white shadow-md">
                      <Award className="h-3.5 w-3.5" />
                      <span>Featured Ads</span>
                    </div>

                    {/* Carousel Dots */}
                    <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                      <span className="h-1.5 w-4 rounded-full bg-white shadow-sm" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-sm" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-sm" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-sm" />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-1.5 pt-4.5 pb-1 text-left space-y-1.5">
                    <div className="text-xl font-extrabold text-gray-900 tracking-tight">
                      BDT 20,00,000
                    </div>
                    <div className="text-[12px] font-medium text-gray-600">
                      <span className="font-bold text-gray-900">5.234</span> katha |{" "}
                      <span className="font-bold text-gray-900">30</span> unites |{" "}
                      <span className="font-bold text-gray-900">1400</span> sqft |{" "}
                      <span className="text-gray-500">active</span>
                    </div>
                    <div className="text-[12px] text-gray-600 leading-snug pt-0.5">
                      138/23 Motijheel Circular Road, Dhaka
                    </div>
                  </div>
                </div>

                <div className="px-1.5 pb-1 text-left">
                  <div className="text-[12px] font-semibold text-gray-400">
                    Shanta Holdings
                  </div>
                </div>
              </div>

              {/* --- Right Card: Live Performance Dashboard --- */}
              <div className="w-full max-w-[290px] flex flex-col justify-between rounded-[32px] border border-gray-100 bg-white p-5 sm:p-5.5 shadow-[0_30px_70px_rgba(0,0,0,0.15)] transition-transform duration-200 hover:-translate-y-1.5 min-h-[435px]">
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3.5">
                    <h2 className="text-[15px] font-bold text-gray-900">
                      Live Performance
                    </h2>
                    <ChevronRight className="h-4.5 w-4.5 text-gray-900 stroke-[2.5]" />
                  </div>

                  {/* 2x2 Metric Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* View */}
                    <div className="rounded-2xl border border-gray-100 bg-[#f8faf9] p-3 text-left">
                      <div className="text-[11px] font-medium text-gray-500">View</div>
                      <div className="text-base font-bold text-gray-900 mt-0.5">11,200</div>
                      <div className="text-[10px] font-semibold text-[#0ca678] flex items-center gap-0.5 mt-1">
                        <span>↑</span> 18.6%
                      </div>
                    </div>

                    {/* Inquiries */}
                    <div className="rounded-2xl border border-gray-100 bg-[#f8faf9] p-3 text-left">
                      <div className="text-[11px] font-medium text-gray-500">Inquiries</div>
                      <div className="text-base font-bold text-gray-900 mt-0.5">4,200</div>
                      <div className="text-[10px] font-semibold text-[#0ca678] flex items-center gap-0.5 mt-1">
                        <span>↑</span> 24.8%
                      </div>
                    </div>

                    {/* Lead */}
                    <div className="rounded-2xl border border-gray-100 bg-[#f8faf9] p-3 text-left">
                      <div className="text-[11px] font-medium text-gray-500">Lead</div>
                      <div className="text-base font-bold text-gray-900 mt-0.5">200</div>
                      <div className="text-[10px] font-semibold text-[#0ca678] flex items-center gap-0.5 mt-1">
                        <span>↑</span> 14.6%
                      </div>
                    </div>

                    {/* Save */}
                    <div className="rounded-2xl border border-gray-100 bg-[#f8faf9] p-3 text-left">
                      <div className="text-[11px] font-medium text-gray-500">Save</div>
                      <div className="text-base font-bold text-gray-900 mt-0.5">1,200</div>
                      <div className="text-[10px] font-semibold text-[#0ca678] flex items-center gap-0.5 mt-1">
                        <span>↑</span> 22.8%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Container */}
                <div className="mt-3.5 rounded-2xl border border-blue-100/80 bg-gradient-to-b from-[#f0f7ff] to-[#e6f2ff] p-3 overflow-hidden">
                  <div className="relative h-20 w-full">
                    <svg
                      className="h-full w-full overflow-visible"
                      viewBox="0 0 200 70"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>

                      {/* Area */}
                      <path
                        d="M 0,55 Q 25,58 45,50 T 90,44 T 135,32 T 165,22 T 200,10 L 200,70 L 0,70 Z"
                        fill="url(#chartGradient)"
                      />

                      {/* Curve line */}
                      <path
                        d="M 0,55 Q 25,58 45,50 T 90,44 T 135,32 T 165,22 T 200,10"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Points */}
                      <circle cx="0" cy="55" r="2.5" fill="#38bdf8" />
                      <circle cx="45" cy="50" r="2.5" fill="#38bdf8" />
                      <circle cx="90" cy="44" r="2.5" fill="#38bdf8" />
                      <circle cx="135" cy="32" r="2.5" fill="#38bdf8" />
                      <circle cx="165" cy="22" r="2.5" fill="#38bdf8" />
                      <circle cx="200" cy="10" r="3" fill="#0284c7" />
                    </svg>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
