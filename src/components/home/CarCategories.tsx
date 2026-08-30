"use client";

import Link from "next/link";
import { useCallback } from "react";

function lookup(messages: Record<string, any>, key: string): string {
  let value: any = messages;
  for (const k of key.split(".")) {
    value = value?.[k];
  }
  return typeof value === "string" ? value : key;
}

interface CarCategoriesProps {
  messages: Record<string, any>;
  locale: string;
}

const categories = [
  {
    key: "city",
    label: "City",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
    query: "vehicleType=city",
  },
  {
    key: "commercial",
    label: "Commercial",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=80",
    query: "vehicleType=commercial",
  },
  {
    key: "family",
    label: "Family",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80",
    query: "seats=5",
  },
  {
    key: "suv",
    label: "SUV",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
    query: "vehicleType=suv",
  },
];

export function CarCategories({ messages, locale }: CarCategoriesProps) {
  const t = useCallback((key: string) => lookup(messages, key), [messages]);

  return (
    <section id="categories" className="bg-[#f4f1ea] py-20 dark:bg-[#0b0b10]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 border-b border-[#130f1f]/10 pb-8 dark:border-white/10 md:flex-row md:items-end">
          <div>
            <p className="w-fit border border-[#130f1f]/15 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-[#5b5668] dark:border-white/10 dark:bg-white/5 dark:text-white/55">
              {t("home.categories_title")}
            </p>
            <h2 className="mt-5 max-w-2xl text-4xl font-black leading-tight tracking-[-0.04em] text-[#130f1f] dark:text-white sm:text-5xl">
              Ihtiyacina uygun koleksiyonu sec.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-[#5b5668] dark:text-white/65">
            Sehir ici pratik kullanimdan aile yolculuguna kadar her plan icin filtrelenmis arac gruplari.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {categories.map((cat, index) => (
            <Link
              key={cat.key}
              href={`/${locale}/search?${cat.query}`}
              className="group relative min-h-[360px] overflow-hidden border border-[#130f1f]/15 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[12px_12px_0_rgba(19,15,31,0.12)] dark:border-white/10 dark:bg-[#12121a] dark:hover:shadow-[12px_12px_0_rgba(255,255,255,0.05)]"
            >
              <img src={cat.image} alt={cat.label} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,15,31,0.08),rgba(19,15,31,0.82))]" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-white/65">0{index + 1}</p>
                <h3 className="mt-2 text-2xl font-black">{t(`home.${cat.key}`)}</h3>
                <p className="mt-3 text-sm leading-6 text-white/75">Musait araclari gor ve haritada karsilastir.</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
