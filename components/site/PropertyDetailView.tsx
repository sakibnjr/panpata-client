"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  EyeOff,
  MapPin,
  Building2,
  Store,
  GraduationCap,
  PlusCircle,
  ImageIcon,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getOptimizedImageUrl } from "@/lib/utils";
import type { PropertyDetail } from "@/lib/properties";

interface PropertyDetailViewProps {
  property: PropertyDetail;
  postedDays: number;
}

export function PropertyDetailView({
  property: p,
  postedDays,
}: PropertyDetailViewProps) {
  // Only use images strictly coming from the backend
  const rawGallery: string[] = (
    Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image]
  ).filter(
    (img): img is string => typeof img === "string" && img.trim().length > 0,
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I'm interested in ${p.address || "Basila Graden City, Mohammadpur, Dhaka"}`,
    agreed: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasImages = rawGallery.length > 0;
  const currentHeroUrl = rawGallery[activeImageIndex] || rawGallery[0] || "";
  const totalSlides = rawGallery.length;

  const handlePrevImage = () => {
    if (totalSlides <= 1) return;
    setActiveImageIndex((prev) => (prev <= 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (totalSlides <= 1) return;
    setActiveImageIndex((prev) => (prev >= totalSlides - 1 ? 0 : prev + 1));
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(
      !isSaved ? "Saved to your favorites!" : "Removed from favorites",
    );
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } else {
      toast.success("Share dialog opened");
    }
  };

  const handleHide = () => {
    setIsHidden(!isHidden);
    toast.info(
      !isHidden ? "Listing hidden from search results" : "Listing unhidden",
    );
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!formData.agreed) {
      toast.error("Please agree to the Privacy Policy.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        "Inquiry sent successfully! An agent will contact you soon.",
      );
      setFormData((prev) => ({ ...prev, name: "", email: "", phone: "" }));
    }, 800);
  };

  // Format currency with standard Bangladeshi styling (e.g., ৳50,00,000)
  const formatBDTCurrency = (amount: number) => {
    const safeAmount =
      typeof amount === "number" && !isNaN(amount) ? amount : 50000000;
    return `৳${safeAmount.toLocaleString("en-IN")}`;
  };

  const pricePerSqft =
    p.sqft && p.sqft > 0 && p.price ? Math.round(p.price / p.sqft) : 2355;
  const areaName =
    p.address?.split(",").slice(-2)[0]?.trim() || "Mohammadpur, Dhaka";
  const agentDisplayName = p.agent?.displayName || "Asad Mondol";

  // Specials tags
  const specialsList = [
    "Lift",
    "Swimming pool",
    "Children's play area",
    "Prayer room",
    "Car parking",
    "Gym",
    "Water pump",
    "Generator",
    "Common area",
    "24/7 Security",
    "CCTV camera",
    "Fire Safety",
    "Rooftop garden",
  ];

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Top Bar Navigation */}
      <div className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/buy"
            className="flex items-center gap-1 text-xs font-semibold text-slate-800 transition-colors hover:text-emerald-700 sm:text-sm"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to search</span>
          </Link>

          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo.png"
              alt="panpata"
              className="h-8 w-auto object-contain sm:h-9"
            />
          </Link>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-700 sm:gap-6 sm:text-sm">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 transition-colors hover:text-emerald-700 cursor-pointer"
            >
              <Heart
                className={`h-4 w-4 ${
                  isSaved ? "fill-rose-500 text-rose-500" : "text-slate-600"
                }`}
              />
              <span>Save</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 transition-colors hover:text-emerald-700 cursor-pointer"
            >
              <Share2 className="h-4 w-4 text-slate-600" />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={handleHide}
              className="flex items-center gap-1.5 transition-colors hover:text-emerald-700 cursor-pointer"
            >
              <EyeOff
                className={`h-4 w-4 ${
                  isHidden ? "text-rose-500" : "text-slate-600"
                }`}
              />
              <span>Hide</span>
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        {/* Photo Gallery Grid */}
        <section
          className={`grid grid-cols-1 gap-1.5 overflow-hidden rounded-xl ${
            rawGallery.length > 1 ? "lg:grid-cols-12" : ""
          }`}
        >
          {/* Main Hero Image */}
          <div
            className={`relative h-[280px] w-full overflow-hidden bg-slate-100 sm:h-[380px] ${
              rawGallery.length > 1 ? "lg:col-span-7" : "lg:col-span-12"
            } lg:h-[450px]`}
          >
            {hasImages && currentHeroUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={getOptimizedImageUrl(currentHeroUrl)}
                alt={p.address || "Property image"}
                className="h-full w-full object-cover transition-all duration-300"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                <ImageIcon className="h-12 w-12 stroke-[1.5]" />
                <span className="mt-2 text-xs font-medium">
                  No image available
                </span>
              </div>
            )}

            {/* Badges on Top Left */}
            <div className="absolute left-3.5 top-3.5 flex items-center gap-1.5">
              <span className="rounded-md bg-[#0D8259] px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs">
                {p.type || "House"} for sale
              </span>
              <span className="rounded-md bg-[#0D8259] px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs">
                Verified
              </span>
            </div>

            {/* Photo Counter on Top Right */}
            {totalSlides > 0 && (
              <div className="absolute right-3.5 top-3.5">
                <span className="rounded-md bg-black/60 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
                  {`${activeImageIndex + 1}/${totalSlides}`}
                </span>
              </div>
            )}

            {/* Left & Right Navigation Arrows */}
            {totalSlides > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/75 text-white shadow-md transition-all hover:bg-black cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/75 text-white shadow-md transition-all hover:bg-black cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            {/* Slider Dots */}
            {totalSlides > 1 && (
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 backdrop-blur-xs">
                {rawGallery.slice(0, 5).map((_, dot) => (
                  <button
                    type="button"
                    key={dot}
                    onClick={() => setActiveImageIndex(dot)}
                    className={`h-2 rounded-full transition-all ${
                      dot === activeImageIndex
                        ? "w-4 bg-slate-900"
                        : "w-2 bg-slate-900/50 hover:bg-slate-900"
                    }`}
                    aria-label={`Go to slide ${dot + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 2x2 Sub-Grid on Right (Only rendered when there are additional backend images) */}
          {rawGallery.length > 1 && (
            <div className="grid grid-cols-2 gap-1.5 lg:col-span-5 lg:h-[450px]">
              {rawGallery.slice(1, 5).map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImageIndex(idx + 1)}
                  className="group relative h-[140px] w-full cursor-pointer overflow-hidden bg-slate-100 sm:h-[185px] lg:h-auto"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getOptimizedImageUrl(imgUrl)}
                    alt={`Property photo ${idx + 2}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 left-2 rounded-xs bg-black/30 px-1.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
                    Photo {idx + 2}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Main Content & Sidebar Grid */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Details & Information */}
          <div className="space-y-6 lg:col-span-8">
            {/* Price Cut Pill */}
            <div>
              <span className="inline-block rounded-md bg-[#0D8259] px-2.5 py-1 text-[11px] font-bold text-white">
                Price cut: ৳50k(August 15)
              </span>
            </div>

            {/* Price Header */}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {formatBDTCurrency(p.price || 50000000)}
              </h1>

              {/* Beds / Baths / Sqft / Katha Bar */}
              <div className="mt-2.5 flex items-center gap-3 text-sm text-slate-700 sm:text-base">
                <span className="font-semibold">
                  <strong className="text-slate-900 font-extrabold">
                    {p.beds || 3}
                  </strong>{" "}
                  beds
                </span>
                <span className="h-4 w-px bg-slate-300" />
                <span className="font-semibold">
                  <strong className="text-slate-900 font-extrabold">
                    {p.baths || 3}
                  </strong>{" "}
                  baths
                </span>
                <span className="h-4 w-px bg-slate-300" />
                <span className="font-semibold">
                  <strong className="text-slate-900 font-extrabold">
                    {(p.sqft || 2450).toLocaleString()}
                  </strong>{" "}
                  sqft
                </span>
                <span className="h-4 w-px bg-slate-300" />
                <span className="font-semibold">
                  <strong className="text-slate-900 font-extrabold">5</strong>{" "}
                  katha
                </span>
              </div>

              {/* Location */}
              <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                <MapPin className="h-4 w-4 text-slate-900 shrink-0" />
                <span>
                  {p.address || "Basila Graden City, Mohammadpur, Dhaka"}
                </span>
              </div>
            </div>

            {/* 2x4 Key Property Details Grid */}
            <div className="pt-2">
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 sm:grid-cols-4">
                <div>
                  <div className="text-base font-extrabold text-slate-900 sm:text-lg">
                    {p.type || "Flat"}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Property type
                  </div>
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 sm:text-lg">
                    4th
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Floor
                  </div>
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 sm:text-lg">
                    ৳40,000
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    DNCC Holding Tax
                  </div>
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 sm:text-lg">
                    ৳{pricePerSqft.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Price per sqft
                  </div>
                </div>

                <div>
                  <div className="text-base font-extrabold text-slate-900 sm:text-lg">
                    ৳20,000
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Monthly rent
                  </div>
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 sm:text-lg">
                    ৳20,000
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Monthly rent
                  </div>
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 sm:text-lg">
                    Real estate
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Built Property
                  </div>
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 sm:text-lg">
                    2018
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Year built
                  </div>
                </div>
              </div>

              {/* Decorative accent divider line */}
              <div className="mt-5 h-[2px] w-full rounded-full bg-[#0D8259]/25" />
            </div>

            {/* What's Specials Section */}
            <div className="space-y-3 pt-1">
              <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                What&apos;s Specials
              </h2>
              <div className="flex flex-wrap gap-2">
                {specialsList.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-slate-200 bg-slate-100/90 px-3 py-1.5 text-xs font-bold text-slate-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description Text with bold highlights */}
            <div className="space-y-3 text-xs leading-relaxed text-slate-700 sm:text-sm">
              <p>
                A Bright, Spacious &amp; Well-Maintained Home for Sale{" "}
                <strong className="font-bold text-slate-900">
                  Featuring 3 bedrooms, 2 bathrooms, and 2 balconies,
                </strong>{" "}
                this home offers a comfortable and convenient living
                environment. The entire property is tiled and beautifully
                finished in white, with significant investment made in the
                finishing work. With plenty of natural light and fresh air, the
                home is bright and well-ventilated throughout the day.{" "}
                <strong className="font-bold text-slate-900">
                  A piped gas connection is also available,
                </strong>{" "}
                eliminating the need for gas cylinders. The property is
                relatively new and has been rented to only two tenants. The
                owner is now selling the property due to a personal reason.
              </p>
            </div>

            {/* Engagement Metrics Row */}
            <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold text-slate-800 pt-1">
              <span className="flex items-baseline gap-1">
                <strong className="font-extrabold text-slate-900">
                  {postedDays > 0 ? postedDays : 28} days
                </strong>{" "}
                <span className="border-b-2 border-[#0D8259] pb-0.5">
                  on Panpata
                </span>
              </span>
              <span className="h-4 w-px bg-slate-300" />
              <span className="flex items-baseline gap-1">
                <strong className="font-extrabold text-slate-900">
                  {(p.views || 793).toLocaleString()}
                </strong>{" "}
                <span className="border-b-2 border-[#0D8259] pb-0.5">
                  views
                </span>
              </span>
              <span className="h-4 w-px bg-slate-300" />
              <span className="flex items-baseline gap-1">
                <strong className="font-extrabold text-slate-900">38</strong>{" "}
                <span className="border-b-2 border-[#0D8259] pb-0.5">
                  saves
                </span>
              </span>
            </div>

            {/* Listed by line */}
            <div className="text-xs font-semibold text-slate-800 sm:text-sm">
              Listed by: {agentDisplayName}, Seltech real estate group
            </div>

            {/* Nearby Amenities Section */}
            <div className="space-y-4 pt-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                  Nearby Amenities
                </h2>
                <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                  <MapPin className="h-3.5 w-3.5 text-[#0D8259]" />
                  <span className="border-b border-[#0D8259] pb-0.5 font-semibold text-slate-800">
                    {areaName}
                  </span>
                </div>
              </div>

              {/* Amenity Cards Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {/* 1. Road Access & Connectivity */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Building2 className="h-4 w-4 text-[#0D8259]" />
                    <span>Road Access &amp; Connectivity</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-100/70 p-2 shadow-2xs">
                    {hasImages && currentHeroUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={getOptimizedImageUrl(currentHeroUrl)}
                        alt="Road Access"
                        className="h-14 w-18 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-18 items-center justify-center rounded-lg bg-slate-200 text-slate-400">
                        <Building2 className="h-6 w-6" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold text-slate-900">
                        West, Shewrapara
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Main Road
                      </div>
                      <div className="text-[10px] font-medium text-slate-600">
                        Distance : 0.8k.m
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Bazar */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Store className="h-4 w-4 text-[#0D8259]" />
                    <span>Bazar</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-100/70 p-2 shadow-2xs">
                    {hasImages && currentHeroUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={getOptimizedImageUrl(currentHeroUrl)}
                        alt="Bazar"
                        className="h-14 w-18 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-18 items-center justify-center rounded-lg bg-slate-200 text-slate-400">
                        <Store className="h-6 w-6" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold text-slate-900">
                        West, Shewrapara
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Daily Market
                      </div>
                      <div className="text-[10px] font-medium text-slate-600">
                        Distance : 2 k.m
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. School & College */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <GraduationCap className="h-4 w-4 text-[#0D8259]" />
                    <span>School &amp; College</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-100/70 p-2 shadow-2xs">
                    {hasImages && currentHeroUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={getOptimizedImageUrl(currentHeroUrl)}
                        alt="School"
                        className="h-14 w-18 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-18 items-center justify-center rounded-lg bg-slate-200 text-slate-400">
                        <GraduationCap className="h-6 w-6" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold text-slate-900">
                        Monipur High School &amp; College Branch - 03
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Class 1 to 12
                      </div>
                      <div className="text-[10px] font-medium text-slate-600">
                        Distance : 1 k.m
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Hospital */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <PlusCircle className="h-4 w-4 text-[#0D8259]" />
                    <span>Hospital</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-100/70 p-2 shadow-2xs">
                    {hasImages && currentHeroUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={getOptimizedImageUrl(currentHeroUrl)}
                        alt="Hospital"
                        className="h-14 w-18 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-18 items-center justify-center rounded-lg bg-slate-200 text-slate-400">
                        <PlusCircle className="h-6 w-6" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold text-slate-900">
                        Popular Diagnostic Centre Ltd.
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Private Hospital
                      </div>
                      <div className="text-[10px] font-medium text-slate-600">
                        Distance : 2 k.m
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky "More about this property" Form Card */}
          <div className="lg:col-span-4">
            <aside className="sticky top-20 rounded-2xl border border-slate-300 bg-white p-5 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
                More about this property
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Connect with Our Agent in Just One Click
              </p>

              <form onSubmit={handleSubmitForm} className="mt-4 space-y-3">
                <div>
                  <Input
                    type="text"
                    placeholder="Name *"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="h-10 rounded-md border-slate-300 bg-white text-xs placeholder:text-slate-400 focus-visible:border-emerald-700 focus-visible:ring-emerald-700"
                  />
                </div>

                <div>
                  <Input
                    type="email"
                    placeholder="Email *"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-10 rounded-md border-slate-300 bg-white text-xs placeholder:text-slate-400 focus-visible:border-emerald-700 focus-visible:ring-emerald-700"
                  />
                </div>

                <div>
                  <Input
                    type="tel"
                    placeholder="Phone *"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="h-10 rounded-md border-slate-300 bg-white text-xs placeholder:text-slate-400 focus-visible:border-emerald-700 focus-visible:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-400">
                    How can an agent help?
                  </label>
                  <Textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="min-h-[70px] resize-none rounded-md border-slate-300 bg-white text-xs text-slate-700 placeholder:text-slate-400 focus-visible:border-emerald-700 focus-visible:ring-emerald-700"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id="privacy"
                    checked={formData.agreed}
                    onCheckedChange={(c) =>
                      setFormData({ ...formData, agreed: c === true })
                    }
                    className="border-slate-400 data-[state=checked]:bg-[#0D8259] data-[state=checked]:border-[#0D8259]"
                  />
                  <label
                    htmlFor="privacy"
                    className="text-[11px] text-slate-600 cursor-pointer"
                  >
                    I agree to the Privacy Policy
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 h-11 w-full rounded-lg bg-[#0D8259] text-sm font-bold text-white hover:bg-[#0b6f4c] shadow-xs cursor-pointer"
                >
                  {isSubmitting ? "Sending..." : "Email agent"}
                </Button>
              </form>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
