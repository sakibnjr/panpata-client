"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Building2, MapPin, Award, TrendingUp } from "lucide-react";

const stats = [
  { icon: Users, value: 1200, suffix: "+", label: "Verified agents" },
  { icon: Building2, value: 8500, suffix: "+", label: "Properties listed" },
  { icon: MapPin, value: 32, suffix: "", label: "Cities covered" },
  { icon: Award, value: 15000, suffix: "+", label: "Happy clients" },
  { icon: TrendingUp, value: 98, suffix: "%", label: "Client satisfaction" },
];

function formatNum(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return n.toString();
}

function useCountUp(target: number, start: boolean, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return val;
}

function StatItem({ icon: Icon, value, suffix, label }: typeof stats[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const n = useCountUp(value, inView);
  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-3xl font-extrabold text-foreground sm:text-4xl">
        {value >= 1000 ? formatNum(n) : n}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="border-y bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Trusted by thousands across Bangladesh</h2>
          <p className="mt-2 text-sm text-muted-foreground">Our marketplace in numbers</p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
