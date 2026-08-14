const WHY_CARDS = [
  {
    title: "Right audience",
    desc: "Reach thousands of potential buyers every day with Paanpata.",
  },
  {
    title: "Maximum Visibility",
    desc: "Get your property seen across our website and social media platforms.",
  },
  {
    title: "Trusted Platform",
    desc: "Connect with a growing community through a trusted real estate platform.",
  },
  {
    title: "Sell Faster",
    desc: "Connect with serious buyers and move closer to a successful sale.",
  },
  {
    title: "Reliable Support",
    desc: "Our Expert Team Is Always Ready to Support You.",
  },
];

export function AdWhyAdvertise() {
  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center tracking-tight">
          Why advertise on paanpata?
        </h2>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
          {WHY_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center text-center rounded-[24px] bg-white p-6 sm:p-7 border border-gray-100/90 shadow-[0_20px_45px_rgba(0,0,0,0.11)] min-h-[220px] transition-transform duration-200 hover:-translate-y-1"
            >
              <h3 className="text-base font-bold text-gray-900">
                {card.title}
              </h3>
              <p className="mt-3 text-[12px] text-gray-500 leading-relaxed max-w-[190px]">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
