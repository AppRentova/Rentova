"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addDays } from "date-fns";
import { DateTimePicker } from "@/components/ui";
import { useGeolocation } from "@/hooks/useGeolocation";

interface HeroProps {
  messages: Record<string, any>;
  locale: string;
}

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDcKYwJBwJ9mQruwUq89b8kgaTEHdJBDxijY3RY9yxXQ86RvTpbG5aQskTpDziGXGNbi1kS2b46AuTneRwqPKOEok56dxjNA6C2D1jd9PdyDBbcmC6N2ueig5i8sdOPhI99DdDzjcaiGOUqll54nGzfeM9JS2Qinrn9dbJFzNSFAaehpookHKEek5IYNPOEiWE8WgsJJRXahLSHtPH9jIlOZld43wesypYy1TCIkvLVuNeICwfhFPvh";

const quickStats = [
  ["250+", "aktif arac"],
  ["78", "ilce"],
  ["4.6/5", "magaza puani"],
];

function Icon({ name }: { name: "car" | "search" | "pin" | "calendar" | "booking" | "message" | "user" }) {
  const paths = {
    car: "M5 17h14l-1.4-5.2A3 3 0 0014.7 9H9.3a3 3 0 00-2.9 2.8L5 17zm2 0v2m10-2v2M7.5 14h.01M16.5 14h.01M8 9l1-3h6l1 3",
    search: "M11 19a8 8 0 100-16 8 8 0 000 16zm6-2l4 4",
    pin: "M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11zm0-8a3 3 0 100-6 3 3 0 000 6z",
    calendar: "M7 3v4m10-4v4M4 9h16M5 5h14v16H5V5z",
    booking: "M6 6h12v14H6V6zm3-3v5m6-5v5M9 13h6",
    message: "M4 5h16v11H8l-4 4V5z",
    user: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0",
  };

  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[name]} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
    <>
      <section className="bg-[#fcf9f8] px-5 pb-16 pt-24 text-[#1b1b1c] dark:bg-[#121212] dark:text-white md:px-16 md:pb-20 md:pt-28">
        <div className="mx-auto max-w-[1280px]">
          <div className="relative flex min-h-[500px] flex-col items-center justify-center overflow-visible rounded-[24px] bg-white p-6 text-center shadow-[0_8px_24px_rgba(0,0,0,0.12)] md:min-h-[600px]">
            <div className="absolute inset-0 overflow-hidden rounded-[24px]">
              <img src={heroImage} alt="Scenic road with a modern rental car" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/5 to-black/65" />
            </div>

            <div className="relative z-10 w-full max-w-4xl">
              <h1 className="font-[var(--font-heading)] text-[42px] font-bold leading-[1.05] tracking-[-0.02em] text-white drop-shadow-md md:text-[64px]">
                Yolun hazir, arac yakininda.
              </h1>
              <p className="mx-auto mt-4 max-w-2xl font-[var(--font-body)] text-lg leading-7 text-white/90 md:text-xl">
                Turkiye icin tasarlanmis arac paylasim deneyimi. Konumunu sec, tarih araligini belirle, en yakin araci haritada gor.
              </p>

              <form onSubmit={handleSearch} className="relative z-30 mx-auto mt-8 max-w-5xl rounded-2xl bg-white/90 p-4 text-left shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md dark:bg-[#1e1e1f]/92">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
                  <label className="flex min-h-14 items-center gap-3 rounded-xl border border-[#cec3d2] bg-[#f5f5f5] px-4 transition focus-within:border-[#653496] dark:border-white/10 dark:bg-[#2a2a2c]">
                    <span className="text-[#4b4451] dark:text-[#dcd9d9]">
                      <Icon name="pin" />
                    </span>
                    <input
                      className="w-full border-none bg-transparent p-0 font-[var(--font-body)] text-base text-[#1b1b1c] outline-none placeholder:text-[#4b4451] focus:ring-0 dark:text-white dark:placeholder:text-white/55"
                      placeholder="Nereye?"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleUseLocation}
                    disabled={geo.loading}
                    className="min-h-14 rounded-xl bg-[#275dae] px-6 font-[var(--font-body)] text-sm font-bold text-white transition hover:bg-[#004899] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
                  >
                    {geo.loading ? "Konum aliniyor" : "GPS ile bul"}
                  </button>
                </div>

                <div className="mt-4">
                  <DateTimePicker
                    locale={locale}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(start, end) => {
                      setStartDate(start);
                      setEndDate(end);
                    }}
                  />
                </div>

                {geo.error && <p className="mt-3 text-sm font-semibold text-[#ba1a1a]">{geo.error}</p>}

                <button className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#653496] px-8 font-[var(--font-body)] text-sm font-bold tracking-[0.05em] text-white transition hover:bg-[#4d187d] active:scale-[0.99]">
                  <Icon name="search" />
                  Arac ara
                </button>
              </form>

              <div className="mx-auto mt-6 grid max-w-2xl grid-cols-3 gap-3">
                {quickStats.map(([value, label]) => (
                  <div key={value} className="rounded-xl bg-white/18 p-4 text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/24">
                    <p className="font-[var(--font-heading)] text-2xl font-bold">{value}</p>
                    <p className="mt-1 text-xs font-semibold text-white/78">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around bg-[#fcf9f8] px-4 py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] dark:bg-[#121212] md:hidden">
        <Link href={`/${locale}`} className="flex flex-col items-center rounded-xl bg-[#f0dbff] px-4 py-1 text-[#2c0051] active:scale-90">
          <Icon name="search" />
          <span className="mt-1 text-xs font-semibold">Kesfet</span>
        </Link>
        <Link href={`/${locale}/trips`} className="flex flex-col items-center px-4 py-1 text-[#4b4451] dark:text-white/70 active:scale-90">
          <Icon name="booking" />
          <span className="mt-1 text-xs font-semibold">Seyahat</span>
        </Link>
        <Link href={`/${locale}/messages`} className="flex flex-col items-center px-4 py-1 text-[#4b4451] dark:text-white/70 active:scale-90">
          <Icon name="message" />
          <span className="mt-1 text-xs font-semibold">Mesaj</span>
        </Link>
        <Link href={`/${locale}/dashboard/profile`} className="flex flex-col items-center px-4 py-1 text-[#4b4451] dark:text-white/70 active:scale-90">
          <Icon name="user" />
          <span className="mt-1 text-xs font-semibold">Profil</span>
        </Link>
      </nav>
    </>
  );
}
