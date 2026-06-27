"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DateTimePicker } from "@/components/ui";
import { addDays } from "date-fns";

function lookup(messages: Record<string, any>, key: string): string {
  let value: any = messages;
  for (const k of key.split(".")) {
    value = value?.[k];
  }
  return typeof value === "string" ? value : key;
}

interface HeroProps {
  messages: Record<string, any>;
  locale: string;
}

const highlightPills = [
  { title: "7/24 erişim", desc: "Her an kirala, her an ilan ver." },
  { title: "Türkiye odaklı", desc: "Şehir, mahalle ve konum bazlı keşif." },
  { title: "Güvenli ödeme", desc: "Kiralama öncesi doğrulanmış akışlar." },
];

export function Hero({ messages, locale }: HeroProps) {
  const router = useRouter();
  const t = useCallback((key: string) => lookup(messages, key), [messages]);
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
    <section className="relative overflow-hidden bg-[#fbf8ff] pt-24">
      <div className="absolute inset-0">
        <div className="absolute -left-16 top-12 h-64 w-64 rounded-full bg-[rgba(180,0,180,0.12)] blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[rgba(29,17,56,0.08)] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-[rgba(180,0,180,0.08)] blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(180,0,180,0.15)] bg-white/80 px-4 py-2 text-xs font-semibold text-[var(--primary-purple)] shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[var(--primary-purple)]" />
            Türkiye için yeniden tasarlanmış araç paylaşım deneyimi
          </div>

          <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight text-[#1d1138] sm:text-6xl lg:text-7xl">
            {locale === "tr" ? "Araç kiralamayı" : "Rent a car"}
            <span className="mt-2 block text-[var(--primary-purple)]">
              {locale === "tr" ? "daha hızlı, daha güvenli" : "faster, safer, simpler"}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
            {locale === "tr"
              ? "Şehir içi kullanım, hafta sonu kaçamağı veya uzun yol için doğru aracı saniyeler içinde bul. Aracını listelemek de kiralamak kadar kolay."
              : "Find the right car in seconds for city trips, weekend escapes, or long drives. Listing your car is just as easy as renting one."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {highlightPills.map((pill) => (
              <div
                key={pill.title}
                className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur"
              >
                <p className="text-sm font-bold text-[#1d1138]">{pill.title}</p>
                <p className="text-xs text-gray-500">{pill.desc}</p>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-10 max-w-2xl rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_25px_80px_rgba(29,17,56,0.12)] backdrop-blur"
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
                  placeholder={locale === "tr" ? "İstanbul, Kadıköy, İzmir..." : "Istanbul, Kadikoy, Izmir..."}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-[#faf9fd] py-4 pl-12 pr-5 text-sm font-medium text-gray-900 outline-none transition focus:border-[var(--primary-purple)] focus:ring-2 focus:ring-[rgba(180,0,180,0.15)]"
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
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#b400b4,#6d2ef0)] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[rgba(180,0,180,0.25)] transition hover:translate-y-[-1px] hover:shadow-xl"
              >
                {locale === "tr" ? "Araçları keşfet" : "Search cars"}
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["A", "K", "M"].map((item) => (
                  <div
                    key={item}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white bg-[#1d1138] text-xs font-bold text-white shadow"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-semibold text-[#1d1138]">12.000+ kullanıcı</p>
                <p className="text-xs text-gray-500">
                  {locale === "tr" ? "İlk sürüm için güçlü başlangıç" : "A strong start for the first release"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#ffc600]">★★★★★</span>
              <span className="font-semibold text-[#1d1138]">4.9/5</span>
              <span className="text-xs text-gray-500">
                {locale === "tr" ? "kiralama memnuniyeti" : "rental satisfaction"}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative mx-auto flex max-w-[420px] justify-center">
            <div className="absolute -left-8 top-10 h-28 w-28 rounded-3xl bg-[rgba(180,0,180,0.14)] blur-2xl" />
            <div className="absolute -right-2 top-24 h-40 w-40 rounded-full bg-[rgba(29,17,56,0.12)] blur-2xl" />

            <div className="relative w-full rounded-[36px] border border-white/70 bg-gradient-to-b from-[#1d1138] to-[#27184b] p-5 shadow-[0_30px_80px_rgba(29,17,56,0.2)]">
              <div className="rounded-[28px] bg-white p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span>Current position</span>
                  <span>Today</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-10 rounded-2xl ${
                        i % 3 === 0 ? "bg-[rgba(180,0,180,0.16)]" : i % 2 === 0 ? "bg-gray-100" : "bg-[rgba(109,46,240,0.12)]"
                      }`}
                    />
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between rounded-2xl border border-gray-100 bg-[#faf9fd] p-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500">From</p>
                    <p className="text-sm font-bold text-[#1d1138]">€29 / day</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-[linear-gradient(135deg,#b400b4,#6d2ef0)] text-white flex items-center justify-center font-bold">
                    →
                  </div>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-[28px] border border-white/10 bg-white/10 p-4 backdrop-blur">
                <div className="aspect-[4/3] rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,255,255,0.82))] p-4 shadow-inner">
                  <div className="relative h-full rounded-[20px] bg-[linear-gradient(135deg,#dfe8ff,#f6f0ff)] p-4">
                    <div className="absolute right-4 top-4 rounded-2xl bg-white/90 px-3 py-1 text-xs font-bold text-[#1d1138] shadow">
                      Mini Cooper
                    </div>
                    <div className="absolute left-4 top-6 rounded-full bg-[var(--primary-purple)] px-3 py-1 text-xs font-bold text-white shadow-lg">
                      4.8 ★
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 rounded-[20px] bg-white/95 p-3 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-20 rounded-2xl bg-[linear-gradient(135deg,#eef2ff,#d6dcff)]" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#1d1138]">Renault Twingo</p>
                          <p className="text-xs text-gray-500">Paylaşımlı araç, anında rezervasyon</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-white">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-2xl font-black">250+</p>
                  <p className="text-xs text-white/70">araç</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-2xl font-black">78</p>
                  <p className="text-xs text-white/70">şehir bölgesi</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-2xl font-black">%96</p>
                  <p className="text-xs text-white/70">tamamlama</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
