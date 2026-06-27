"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DateTimePicker } from "@/components/ui";
import { addDays } from "date-fns";

interface HeroProps {
  messages: Record<string, any>;
  locale: string;
}

const highlightPills = [
  { title: "24/7", desc: "Always on, always ready." },
  { title: "Local", desc: "City, district, and map-based search." },
  { title: "Safe flow", desc: "Verified listing and booking steps." },
];

export function Hero({ messages, locale }: HeroProps) {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 2));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/${locale}/search?q=${encodeURIComponent(location)}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`
    );
  };

  return (
    <section className="relative overflow-hidden bg-white pt-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#1d1138]">
            <span className="h-2 w-2 bg-[var(--primary-purple)]" />
            Turkey-focused car sharing
          </div>

          <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight text-[#1d1138] sm:text-6xl lg:text-7xl">
            {locale === "tr" ? "Arac kiralamayi" : "Rent a car"}
            <span className="mt-2 block text-[var(--primary-purple)]">
              {locale === "tr" ? "daha hizli ve net" : "faster and sharper"}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
            {locale === "tr"
              ? "Sehir ici kullanim, hafta sonu kacagi veya uzun yol icin dogru araci saniyeler icinde bul. Arac listeleme akisi da olabildigince sade tutuldu."
              : "Find the right car in seconds for city trips, weekend escapes, or long drives. Listing flow stays simple and direct."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {highlightPills.map((pill) => (
              <div key={pill.title} className="rounded-none border border-gray-200 bg-white px-4 py-3">
                <p className="text-sm font-bold text-[#1d1138]">{pill.title}</p>
                <p className="text-xs text-gray-500">{pill.desc}</p>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-10 max-w-2xl border border-gray-200 bg-white p-4 shadow-[0_18px_50px_rgba(29,17,56,0.08)]"
          >
            <div className="space-y-4">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[var(--primary-purple)]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={locale === "tr" ? "Istanbul, Kadikoy, Izmir..." : "Istanbul, Kadikoy, Izmir..."}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-none border border-gray-200 bg-white py-4 pl-12 pr-5 text-sm font-medium text-gray-900 outline-none transition focus:border-[var(--primary-purple)]"
                />
              </div>

              <DateTimePicker
                locale={locale}
                startDate={startDate}
                endDate={endDate}
                onChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
              />

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-none bg-[#1d1138] px-6 py-4 text-base font-bold text-white transition hover:bg-black"
              >
                {locale === "tr" ? "Araclari kesfet" : "Search cars"}
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["A", "K", "M"].map((item) => (
                  <div
                    key={item}
                    className="flex h-9 w-9 items-center justify-center rounded-none border border-gray-200 bg-[#1d1138] text-xs font-bold text-white"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-semibold text-[#1d1138]">12.000+ users</p>
                <p className="text-xs text-gray-500">
                  {locale === "tr" ? "Ilk surum icin guclu baslangic" : "A strong start for the first release"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#f59e0b]">★★★★★</span>
              <span className="font-semibold text-[#1d1138]">4.9/5</span>
              <span className="text-xs text-gray-500">
                {locale === "tr" ? "kiralama memnuniyeti" : "rental satisfaction"}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative mx-auto flex max-w-[420px] justify-center">
            <div className="relative w-full border border-gray-200 bg-white p-5 shadow-[0_24px_70px_rgba(29,17,56,0.12)]">
              <div className="border border-gray-200 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span>Current position</span>
                  <span>Today</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className={`h-10 ${i % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`} />
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border border-gray-200 bg-white p-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500">From</p>
                    <p className="text-sm font-bold text-[#1d1138]">€29 / day</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center bg-[#1d1138] text-sm font-bold text-white">
                    →
                  </div>
                </div>
              </div>

              <div className="mt-5 border border-gray-200 bg-white p-4">
                <div className="aspect-[4/3] border border-gray-200 bg-[linear-gradient(180deg,#f8f8f8,#ececec)] p-4">
                  <div className="relative h-full border border-gray-200 bg-white p-4">
                    <div className="absolute right-4 top-4 border border-gray-200 bg-white px-3 py-1 text-xs font-bold text-[#1d1138]">
                      Mini Cooper
                    </div>
                    <div className="absolute left-4 top-6 border border-gray-200 bg-white px-3 py-1 text-xs font-bold text-[#1d1138]">
                      4.8
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 border border-gray-200 bg-white p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-20 bg-gray-200" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#1d1138]">Renault Twingo</p>
                          <p className="text-xs text-gray-500">Direct booking, no visual noise</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-[#1d1138]">
                <div className="border border-gray-200 bg-white p-4">
                  <p className="text-2xl font-black">250+</p>
                  <p className="text-xs text-gray-500">cars</p>
                </div>
                <div className="border border-gray-200 bg-white p-4">
                  <p className="text-2xl font-black">78</p>
                  <p className="text-xs text-gray-500">districts</p>
                </div>
                <div className="border border-gray-200 bg-white p-4">
                  <p className="text-2xl font-black">96%</p>
                  <p className="text-xs text-gray-500">completion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
