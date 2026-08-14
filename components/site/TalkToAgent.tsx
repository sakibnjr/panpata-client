"use client";

import { useState } from "react";

export function TalkToAgent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    zip: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="bg-[#f2f2f2] py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
          {/* ── Left: text ── */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-2xl font-bold leading-snug text-foreground sm:text-3xl">
              Get connected today to one of our top&nbsp;real estate experts.
            </p>
            <p className="mt-4 text-lg text-foreground">
              Or call us at{" "}
              <a
                href="tel:01975261307"
                className="font-semibold text-primary hover:underline"
              >
                01975261307
              </a>
            </p>
          </div>

          {/* ── Right: form card ── */}
          <div className="w-full max-w-sm flex-shrink-0 rounded-2xl bg-white p-7 shadow-md">
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    className="h-7 w-7 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Thank you, {formData.name || "there"}!
                </h3>
                <p className="text-base text-muted-foreground">
                  Our team will contact you shortly after receiving your
                  information and will be happy to assist you with your inquiry.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", phone: "", zip: "" });
                  }}
                  className="mt-2 text-sm font-medium text-primary hover:underline"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Mobile Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="text"
                  name="zip"
                  placeholder="Zip Code"
                  value={formData.zip}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                <p className="text-sm leading-relaxed text-muted-foreground">
                  Our team will contact you shortly after receiving your
                  information and will be happy to assist you with your inquiry.
                </p>

                <button
                  type="submit"
                  className="mt-1 w-full rounded-full bg-primary py-3 text-base font-bold text-white transition hover:opacity-90 active:scale-95"
                >
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
