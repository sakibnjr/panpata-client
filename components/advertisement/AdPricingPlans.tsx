import Link from "next/link";

const AD_PLANS = [
  {
    name: "Free plan",
    subtitle: "Perfect for property owners & small agents",
    price: "৳0",
    features: [
      { included: true, text: "1 basic listing" },
      { included: true, text: "Basic search listing" },
      { included: true, text: "Basic support" },
      { included: false, text: "Homepage exposure" },
      { included: false, text: "Homepage exposure" },
      { included: false, text: "Homepage exposure" },
      { included: false, text: "Project promotion" },
      { included: false, text: "Priority support" },
    ],
  },
  {
    name: "Starter",
    subtitle: "Perfect for property owners & small agents",
    price: "৳2,500",
    features: [
      { included: true, text: "Up to 5 featured listings" },
      { included: true, text: "Basic search listing" },
      { included: true, text: "Property details page" },
      { included: true, text: "Basic Lead Dashboard" },
      { included: true, text: "Social media sharing" },
      { included: false, text: "Homepage exposure" },
      { included: false, text: "Project promotion" },
      { included: false, text: "Priority support" },
    ],
  },
  {
    name: "Professional",
    subtitle: "Best for agents, brokers & small developers",
    price: "৳7,500",
    features: [
      { included: true, text: "Up to 20 featured listings" },
      { included: true, text: "Homepage featured exposure" },
      { included: true, text: "Priority search ranking" },
      { included: true, text: "1 project promotion" },
      { included: true, text: "Social media sharing" },
      { included: true, text: "Dashboard & analtics" },
      { included: true, text: "Professional banner" },
      { included: true, text: "Monthly performance report" },
      { included: true, text: "Priority support" },
    ],
  },
  {
    name: "Premium",
    subtitle: "Best for developers, large projects & property businesses",
    price: "৳15,000",
    features: [
      { included: true, text: "Unlimited featured listings" },
      { included: true, text: "Top search placement" },
      { included: true, text: "Unlimited project promotion" },
      { included: true, text: "Dashboard & analytics" },
      { included: true, text: "Contact/Inquiry tracking" },
      { included: true, text: "Monthly performance report" },
      { included: true, text: "Video content making" },
      { included: true, text: "Verified Badget" },
      { included: true, text: "Priority & vip support" },
    ],
  },
];

export function AdPricingPlans() {
  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center tracking-tight">
          Our Advertising Plans
        </h2>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {AD_PLANS.map((plan, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-[28px] bg-white border border-gray-100/90 shadow-[0_20px_45px_rgba(0,0,0,0.11)] overflow-hidden transition-transform duration-200 hover:-translate-y-1"
            >
              <div>
                {/* Green Top Header */}
                <div className="relative bg-[#00c068] px-5 pt-6 pb-9 text-center text-white">
                  <h3 className="text-xl font-bold tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="mt-1.5 text-[11px] text-white/90 leading-tight">
                    {plan.subtitle}
                  </p>

                  {/* Circle cutout badge */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#00c068] bg-white shadow-xs" />
                </div>

                {/* Pricing & Feature List */}
                <div className="px-5 pt-7 pb-4">
                  {/* Price */}
                  <div className="text-center">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#00c068]">
                      {plan.price}
                    </span>
                    <span className="text-xs font-semibold text-gray-800">
                      /month
                    </span>
                  </div>

                  {/* Separator */}
                  <div className="my-4 border-t border-gray-200" />

                  {/* Feature Items */}
                  <div className="space-y-2.5">
                    {plan.features.map((item, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-center gap-2 text-left"
                      >
                        {item.included ? (
                          <svg
                            className="h-3.5 w-3.5 shrink-0 text-gray-900"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-3.5 w-3.5 shrink-0 text-gray-300"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <span
                          className={`text-[12px] leading-tight ${
                            item.included
                              ? "text-gray-800 font-medium"
                              : "text-gray-400"
                          }`}
                        >
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Button */}
              <div className="px-5 pb-6 pt-2">
                <Link
                  href="/talk-to-agent"
                  className="block w-full rounded-xl border border-[#00c068] py-2.5 text-center text-xs font-semibold text-gray-800 transition hover:bg-[#00c068] hover:text-white"
                >
                  Get started
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Risk-Free Note */}
        <div className="mt-10 text-center">
          <p className="text-sm sm:text-base font-medium text-gray-900">
            Try Our Services Risk-Free — 7-Day Money-Back Guarantee.
          </p>
        </div>
      </div>
    </section>
  );
}
