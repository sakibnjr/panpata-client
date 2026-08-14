"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const GET_STARTED_STEPS = [
  {
    title: "Register Now",
    desc: "Create Your Account in Minutes",
  },
  {
    title: "Choose Your Plan",
    desc: "Choose the Right Plan for Your Needs",
  },
  {
    title: "Advertise Your Property",
    desc: "Add Your Property Details & Photos",
  },
  {
    title: "Get Leads & Make Sales",
    desc: "Get More Leads & Sell Your Property Faster",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "“Advertising on Panpata helped me reach the right buyers, generate quality leads, and sell my flat faster than I expected.”",
    name: "MD Asad Mondol",
    role: "Property Owner",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
  },
  {
    quote:
      "“We featured 12 apartment units in Gulshan and received over 80 verified buyer inquiries in less than three weeks.”",
    name: "Rafiqul Islam",
    role: "Real Estate Broker",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
  },
  {
    quote:
      "“The live analytics dashboard gives complete transparency on impressions and phone calls. Exceptional ROI.”",
    name: "Tanvir Hossain",
    role: "Project Developer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  },
];

export function AdGetStartedAndReviews() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const prevTestimonial = () => {
    setTestimonialIdx((prev) =>
      prev === 0 ? TESTIMONIALS.length - 1 : prev - 1,
    );
  };

  const nextTestimonial = () => {
    setTestimonialIdx((prev) =>
      prev === TESTIMONIALS.length - 1 ? 0 : prev + 1,
    );
  };

  const currentTestimonial = TESTIMONIALS[testimonialIdx];

  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Card: How to Get Started? */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-[28px] bg-white p-7 sm:p-9 border border-gray-100 shadow-[0_20px_45px_rgba(0,0,0,0.08)]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight text-left">
                How to Get Started?
              </h2>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                {GET_STARTED_STEPS.map((step, sIdx) => (
                  <div key={sIdx} className="space-y-1.5">
                    <h3 className="text-xs sm:text-[13px] font-bold text-gray-900 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-normal">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Card: What Our Customers Say */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-[28px] bg-white p-7 sm:p-9 border border-gray-100 shadow-[0_20px_45px_rgba(0,0,0,0.08)]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight text-left">
                What Our Customers Say
              </h2>
              <p className="mt-4 text-xs sm:text-[13px] text-gray-600 leading-relaxed text-left">
                {currentTestimonial.quote}
              </p>

              <div className="mt-5 flex items-center gap-3 text-left">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                  className="h-11 w-11 rounded-full object-cover border border-gray-100"
                />
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    {currentTestimonial.name}
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    {currentTestimonial.role}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Controls: Dots and < > Arrow controls */}
            <div className="mt-6 flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                {TESTIMONIALS.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setTestimonialIdx(dotIdx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      dotIdx === testimonialIdx
                        ? "w-2 bg-gray-900"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prevTestimonial}
                  className="p-1 text-gray-800 hover:text-black transition cursor-pointer"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={nextTestimonial}
                  className="p-1 text-gray-800 hover:text-black transition cursor-pointer"
                  aria-label="Next review"
                >
                  <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
