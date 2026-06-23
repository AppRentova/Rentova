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

export function Hero({ messages, locale }: HeroProps) {
  const router = useRouter();
  const t = useCallback((key: string) => lookup(messages, key), [messages]);
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 2));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/${locale}/search?q=${encodeURIComponent(location)}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-white pt-24 overflow-hidden">
      {/* Background Graphic Swirls */}
      <div className="absolute right-0 bottom-0 w-1/2 h-full pointer-events-none opacity-30 select-none hidden lg:block">
        <svg viewBox="0 0 500 500" className="w-full h-full text-purple-100 fill-current">
          <path d="M100,250 C150,100 350,100 400,250 C450,400 250,450 100,250 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Search Form & Title */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#1d1138] leading-[1.1] tracking-tight">
            {locale === "tr" ? "Birkaç tıkla" : "Rent a car"}<br />
            {locale === "tr" ? "araç kirala" : "in just a few taps"}
          </h1>
          <p className="mt-4 text-xl lg:text-2xl font-extrabold text-brand-purple">
            {locale === "tr" ? "Telefonunla 7/24 araçların kilidini aç ve git!" : "Unlock cars 24/7 with your phone, and go!"}
          </p>

          <form onSubmit={handleSearch} className="mt-8 max-w-xl space-y-6 bg-white p-6 rounded-sm border border-gray-150/80 shadow-xl">
            {/* Address Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={locale === "tr" ? "Adres, istasyon veya şehir yazın..." : "Precise address, train or tube station..."}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-sm border border-gray-300 pl-12 pr-6 py-4 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
              />
            </div>

            {/* Custom Date Time Picker */}
            <DateTimePicker 
              locale={locale} 
              startDate={startDate} 
              endDate={endDate} 
              onChange={(start, end) => { setStartDate(start); setEndDate(end); }}
            />

            {/* Search Button */}
            <button
              type="submit"
              className="w-full bg-brand-purple hover:bg-brand-purple-hover text-white font-bold py-4 rounded-sm text-base transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
            >
              {locale === "tr" ? "Ara" : "Search"}
            </button>
          </form>


          <p className="mt-4 text-xs font-semibold text-gray-500">
            {locale === "tr" ? "Yolculuk sorumluluk sigortası dahil yerel halktan araba kiralama" : "Car rental by locals with trip liability insurance included"}
          </p>

          {/* Download badges & rating */}
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="flex gap-3">
              <a href="#" className="h-10 px-4 bg-[#1d1138] hover:bg-black text-white rounded-sm flex items-center gap-2 border border-gray-800 transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71,19.5 C17.88,20.74 17,21.95 15.66,21.97 C14.32,22 13.89,21.18 12.37,21.18 C10.84,21.18 10.37,21.95 9.1,22 C7.79,22.05 6.8,20.68 5.96,19.47 C4.25,17 2.94,12.45 4.7,9.39 C5.57,7.87 7.13,6.91 8.82,6.88 C10.1,6.86 11.32,7.75 12.11,7.75 C12.89,7.75 14.37,6.68 15.92,6.84 C16.57,6.87 18.39,7.1 19.56,8.82 C19.47,8.88 17.39,10.1 17.41,12.63 C17.44,15.65 20.06,16.66 20.1,16.67 C20.08,16.74 19.67,18.11 18.71,19.5 M15.97,4.17 C16.63,3.37 17.07,2.28 16.95,1 C16,1.04 14.9,1.6 14.24,2.38 C13.68,3.04 13.19,4.14 13.34,5.39 C14.39,5.47 15.4,4.88 15.97,4.17 Z" />
                </svg>
                <div className="text-[10px] text-left">
                  <span className="block text-[8px] text-gray-400">Download on the</span>
                  <span className="font-bold">App Store</span>
                </div>
              </a>
              <a href="#" className="h-10 px-4 bg-[#1d1138] hover:bg-black text-white rounded-sm flex items-center gap-2 border border-gray-800 transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M3,5.27V18.73L16.55,12L3,5.27M17.87,11.33L19.5,12.16L17.87,13L16.9,12.16L17.87,11.33M3,3.15L16.27,9.75L18.47,7.55L3,3.15M3,20.85L18.47,16.45L16.27,14.25L3,20.85Z" />
                </svg>
                <div className="text-[10px] text-left">
                  <span className="block text-[8px] text-gray-400">GET IT ON</span>
                  <span className="font-bold">Google Play</span>
                </div>
              </a>
            </div>

            <div className="flex flex-col text-sm text-gray-600 font-semibold">
              <div className="flex items-center text-[#ffc600]">
                {Array(5).fill(0).map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-xs font-bold text-gray-700">4.6/5</span>
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase">{locale === "tr" ? "100.000+ Değerlendirme" : "from 100 000+ ratings in app stores"}</span>
            </div>
          </div>
        </div>

        {/* Right Phone Mockup */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-[280px] h-[560px] bg-black rounded-sm p-3 shadow-2xl border-4 border-gray-800">
            {/* Speaker & Camera notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-sm z-20 flex items-center justify-center">
              <div className="w-12 h-1 bg-gray-800 rounded-sm" />
              <div className="w-3.5 h-3.5 bg-gray-900 rounded-sm ml-4" />
            </div>

            {/* Screen */}
            <div className="w-full h-full bg-slate-50 rounded-sm overflow-hidden relative flex flex-col pt-8">
              {/* Map mockup interface */}
              <div className="absolute inset-0 bg-purple-50">
                {/* Dot markers */}
                <div className="absolute top-24 left-16 w-3 h-3 bg-[var(--primary-purple)] rounded-sm border border-white animate-pulse" />
                <div className="absolute top-36 right-12 w-3 h-3 bg-[var(--primary-purple)] rounded-sm border border-white" />
                <div className="absolute bottom-40 left-12 w-3 h-3 bg-[var(--primary-purple)] rounded-sm border border-white" />
                <div className="absolute bottom-48 right-20 w-3 h-3 bg-[var(--primary-purple)] rounded-sm border border-white" />

                {/* Main bubble */}
                <div className="absolute top-[160px] right-24 bg-[var(--primary-purple)] text-white text-[10px] font-bold px-3 py-1.5 rounded-sm border-2 border-white shadow-md">
                  €29 <span className="text-[8px] font-normal">/ day</span>
                </div>

                {/* Car card at the bottom */}
                <div className="absolute bottom-4 left-3 right-3 bg-white rounded-sm p-3 shadow-lg border border-gray-100">
                  <div className="aspect-[16/10] bg-gray-100 rounded-sm overflow-hidden relative mb-2">
                    {/* Simulated Car image */}
                    <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-100 to-purple-200 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-purple-700">Mini Cooper</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">Mini Cooper</h4>
                  <div className="flex items-center text-[#ffc600] mt-0.5">
                    {Array(5).fill(0).map((_, i) => (
                      <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

