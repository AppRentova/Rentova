"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addDays } from "date-fns";
import { DateTimePicker } from "@/components/ui";
import { useGeolocation } from "@/hooks/useGeolocation";

interface HeroProps {
  messages: Record<string, any>;
  locale: string;
}

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=2200&q=85";

const sideCards = [
  {
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    title: "Hafta sonu",
    meta: "Coupe, SUV, cabrio",
  },
  {
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=900&q=80",
    title: "Sehir ici",
    meta: "Dakikalar icinde teslim",
  },
];

const quickStats = [
  ["250+", "aktif arac"],
  ["78", "ilce kapsami"],
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
    <section className="relative isolate overflow-visible bg-[#f4f1ea] pt-16 text-[#130f1f] dark:bg-[#0b0b10] dark:text-white">
      <div className="absolute inset-x-0 top-16 h-px bg-black/10 dark:bg-white/10" />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
        <div className="relative z-20 flex flex-col justify-center">
          <p className="w-fit border border-black/15 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.32em] text-[#130f1f] shadow-sm dark:border-white/15 dark:bg-white/5 dark:text-white">
            Turkey focused car sharing
          </p>

          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.06em] text-[#130f1f] dark:text-white sm:text-7xl lg:text-8xl">
            Arac kiralamayi
            <span className="block text-[#2b184d] dark:text-[#f3ecff]">daha net yap.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#3f3a4e] dark:text-white/72 sm:text-xl">
            Izmir, Istanbul ve yakindaki ilcelerde araci bul, tarih araligini sec, GPS ile yakindakileri sirala. Ajans karmasasi yok, net fiyat ve hizli rezervasyon var.
          </p>

          <form
            onSubmit={handleSearch}
            className="relative z-[80] mt-8 border border-[#130f1f]/15 bg-white p-4 shadow-[16px_16px_0_rgba(19,15,31,0.12)] dark:border-white/15 dark:bg-[#12121a] dark:shadow-[16px_16px_0_rgba(255,255,255,0.06)]"
          >
            <div className="grid gap-3">
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <label className="relative block">
                  <span className="sr-only">Konum</span>
                  <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#653496]" viewBox="0 0 24 24" fill="none">
                    <path d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M12 13a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Istanbul, Kadikoy, Izmir..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-14 w-full border border-[#130f1f]/15 bg-[#f8f6f1] pl-12 pr-4 text-sm font-bold text-[#130f1f] outline-none transition focus:border-[#653496] dark:border-white/10 dark:bg-[#0f0f16] dark:text-white"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleUseLocation}
                  className="h-14 border border-[#123c35] bg-[#123c35] px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#0d2d28] disabled:cursor-wait disabled:opacity-60"
                  disabled={geo.loading}
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
                className="h-14 border border-[#130f1f] bg-[#130f1f] px-6 text-base font-black text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-[#130f1f] dark:border-white dark:bg-white dark:text-[#130f1f] dark:hover:bg-transparent dark:hover:text-white"
              >
                Araclari goster
              </button>
            </div>
          </form>

          <div className="mt-6 grid max-w-xl grid-cols-3 gap-3">
            {quickStats.map(([value, label]) => (
              <div key={value} className="border border-[#130f1f]/15 bg-white/70 p-4 transition hover:-translate-y-1 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                <p className="text-3xl font-black tracking-tight">{value}</p>
                <p className="text-xs font-semibold text-[#5b5668] dark:text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center">
          <div className="relative w-full border border-[#130f1f]/15 bg-white p-4 shadow-[20px_20px_0_rgba(19,15,31,0.13)] dark:border-white/15 dark:bg-[#12121a] dark:shadow-[20px_20px_0_rgba(255,255,255,0.05)]">
            <div className="aspect-[4/5] overflow-hidden border border-[#130f1f]/10">
              <img src={HERO_IMAGE} alt="Rentova ile kiralanmaya hazir arac" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {sideCards.map((card) => (
                <div key={card.title} className="group border border-[#130f1f]/10 bg-[#f4f1ea] p-2 dark:border-white/10 dark:bg-white/5">
                  <img src={card.image} alt={card.title} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:grayscale" />
                  <p className="mt-3 text-sm font-black">{card.title}</p>
                  <p className="text-xs text-[#5b5668] dark:text-white/55">{card.meta}</p>
                </div>
              ))}
            </div>
            <div className="absolute -left-5 top-10 hidden border border-[#130f1f]/15 bg-white px-4 py-3 shadow-lg dark:border-white/15 dark:bg-[#0f0f16] md:block">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#653496]">Rentova Connect</p>
              <p className="text-sm font-black">Telefonla teslim al</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
