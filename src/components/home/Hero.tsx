"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DateTimePicker } from "@/components/ui";
import { useGeolocation } from "@/hooks/useGeolocation";
import { addDays } from "date-fns";

interface HeroProps {
  messages: Record<string, any>;
  locale: string;
}

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=85";

const quickStats = [
  ["250+", "aktif arac"],
  ["7/24", "akilli erisim"],
  ["48s", "ucretsiz iptal"],
];

export function Hero({ locale }: HeroProps) {
  const router = useRouter();
  const geo = useGeolocation();
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 2));

  const buildSearchUrl = (lat?: number | null, lng?: number | null) => {
    const params = new URLSearchParams();
    if (location.trim()) params.set("city", location.trim());
    params.set("start", startDate.toISOString());
    params.set("end", endDate.toISOString());
    if (lat !== null && lat !== undefined && lng !== null && lng !== undefined) {
      params.set("lat", String(lat));
      params.set("lng", String(lng));
    }
    return `/${locale}/search?${params.toString()}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildSearchUrl(geo.latitude, geo.longitude));
  };

  const handleUseLocation = () => {
    geo.requestLocation();
    if (geo.latitude !== null && geo.longitude !== null) {
      setLocation("Konumum");
      router.push(buildSearchUrl(geo.latitude, geo.longitude));
    } else {
      setLocation("Konumum aliniyor...");
    }
  };

  useEffect(() => {
    if (location === "Konumum aliniyor..." && geo.latitude !== null && geo.longitude !== null) {
      setLocation("Konumum");
      router.push(buildSearchUrl(geo.latitude, geo.longitude));
    }
  }, [geo.latitude, geo.longitude, location, router]);

  return (
    <section className="relative isolate overflow-visible bg-white pt-16 dark:bg-[#0c0c12]">
      <div className="absolute inset-0 -z-10">
        <img src={HERO_IMAGE} alt="City car ready for rental" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.96),rgba(255,255,255,0.78)_45%,rgba(255,255,255,0.22))] dark:bg-[linear-gradient(90deg,rgba(12,12,18,0.94),rgba(12,12,18,0.72)_48%,rgba(12,12,18,0.25))]" />
      </div>

      <div className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="inline-flex border border-[#111827]/15 bg-white/90 px-4 py-2 text-xs font-black uppercase text-[#111827] shadow-sm backdrop-blur dark:border-white/15 dark:bg-[#151522]/80 dark:text-white">
            Rentova Turkiye
          </p>

          <h1 className="mt-7 text-5xl font-black leading-[0.95] text-[#111827] dark:text-white sm:text-7xl lg:text-8xl">
            Arabani bul.
            <span className="block text-[var(--primary-purple)]">Yola cik.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-xl leading-8 text-gray-700 dark:text-gray-200">
            Konumuna en yakin araclari bul, tarihini sec, rezervasyonunu tamamla. Rentova, Turkiye icin daha hizli ve daha temiz bir kiralama akisi.
          </p>

          <form
            onSubmit={handleSearch}
            className="relative z-[80] mt-9 border border-gray-200 bg-white/95 p-4 shadow-[0_24px_80px_rgba(17,24,39,0.16)] backdrop-blur dark:border-white/10 dark:bg-[#151522]/95"
          >
            <div className="grid gap-3">
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[var(--primary-purple)]">⌖</span>
                  <input
                    type="text"
                    placeholder="Istanbul, Kadikoy, Izmir..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-14 w-full border border-gray-200 bg-white pl-12 pr-4 text-sm font-bold text-[#111827] outline-none transition focus:border-[var(--primary-purple)] dark:border-white/10 dark:bg-[#101018] dark:text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleUseLocation}
                  className="h-14 border border-gray-200 bg-[#eef7f5] px-5 text-sm font-black text-[#0f766e] transition hover:-translate-y-0.5 hover:border-[#0f766e] dark:border-white/10 dark:bg-[#12312d] dark:text-[#7dd3c7]"
                >
                  {geo.loading ? "Konum aliniyor" : "GPS ile bul"}
                </button>
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

              {geo.error && <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">{geo.error}</p>}

              <button
                type="submit"
                className="h-14 bg-[#111827] px-6 text-base font-black text-white transition hover:-translate-y-0.5 hover:bg-[var(--primary-purple)] dark:bg-white dark:text-[#111827] dark:hover:bg-[var(--primary-purple)] dark:hover:text-white"
              >
                Araclari goster
              </button>
            </div>
          </form>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {quickStats.map(([value, label]) => (
              <div key={value} className="border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#151522]/85">
                <p className="text-2xl font-black text-[#111827] dark:text-white">{value}</p>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
