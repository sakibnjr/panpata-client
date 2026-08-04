import { Home, Map, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const cards = [
  {
    icon: Home,
    title: "Buy a home",
    body: "A real estate agent can provide you with a clear breakdown of costs so that you can avoid surprise expenses.",
    cta: "Find a local agent",
    to: "/buy",
    bg: "/assets/bento-buy.webp",
  },
  {
    icon: Map,
    title: "Land share project",
    body: "No matter what path you take to sell your home, we can help you navigate a successful sale.",
    cta: "See your options",
    to: "/land-share",
    bg: "/assets/bento-land.webp",
  },
  {
    icon: Users,
    title: "Find my agent",
    body: "We're creating a seamless online experience — from shopping on the largest rental network, to applying, to paying rent.",
    cta: "Find rentals",
    to: "/agents",
    bg: "/assets/bento-agent.webp",
  },
];

export function BentoCTAs() {
  return (
    <section className="bg-muted/40 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map(({ icon: Icon, title, body, cta, to, bg }) => (
            <div
              key={title}
              className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-2xl text-center shadow-sm transition hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bg}
                alt=""
                aria-hidden
                loading="lazy"
                width={768}
                height={768}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/85 to-white/20" />
              <div className="relative z-10 flex flex-1 flex-col items-center justify-end p-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary shadow-md ring-4 ring-white/70">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-6 rounded-full border-primary bg-white/90 text-primary backdrop-blur hover:bg-primary hover:text-primary-foreground"
                >
                  <Link href={to}>{cta}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
