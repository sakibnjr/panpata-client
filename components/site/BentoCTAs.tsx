import Link from "next/link";
import Image from "next/image";

const cards = [
  {
    title: "Buy a home",
    body: "Whether you’re searching for flat, apartments, land or buy homes, we make it easy to find a place you'll love.",
    cta: "See more",
    to: "/buy",
    img: "/assets/buy-home.svg",
  },
  {
    title: "Land share project",
    body: "Proper planning, a transparent agreement, and partnering with a trusted developer can help maximize the value.",
    cta: "See more",
    to: "/land-share",
    img: "/assets/land-share.svg",
  },
  {
    title: "Find my agents",
    body: "Panpata agents are among the most experienced in the industry and can help you win in today's market.",
    cta: "Explore agents",
    to: "/agents",
    img: "/assets/find-agent.svg",
  },
];

export function BentoCTAs() {
  return (
    <section className="bg-[#f2f3f5] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          {cards.map(({ title, body, cta, to, img }) => (
            <div
              key={title}
              className="flex w-full min-h-[440px] flex-col items-center justify-between rounded-3xl border border-gray-200/80 bg-white p-8 sm:p-10 text-center shadow-[0_4px_25px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Top Graphic */}
              <div className="flex h-40 w-full items-center justify-center pt-2">
                <Image
                  src={img}
                  alt={title}
                  width={150}
                  height={150}
                  priority
                />
              </div>

              {/* Title & Body */}
              <div className="flex flex-col items-center my-4">
                <h3 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900">
                  {title}
                </h3>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-500 max-w-xs sm:max-w-sm">
                  {body}
                </p>
              </div>

              {/* CTA Button */}
              <Link
                href={to}
                className="inline-flex items-center justify-center rounded-xl border-2 border-[#00c067] px-7 py-3 text-sm font-semibold text-[#00c067] transition-all duration-200 hover:bg-[#00c067] hover:text-white cursor-pointer"
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
