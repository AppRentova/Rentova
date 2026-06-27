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
  { key: "city", icon: "🚗" },
  { key: "commercial", icon: "🚚" },
  { key: "family", icon: "🚐" },
  { key: "suv", icon: "🚙" },
];

export function CarCategories({ messages, locale }: CarCategoriesProps) {
  const t = useCallback((key: string) => lookup(messages, key), [messages]);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-none border border-gray-200 bg-white px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
            {t("home.categories_title")}
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-[#1d1138] sm:text-4xl">
            {locale === "tr" ? "Ihtiyacina uygun araci sec" : "Choose a car for every plan"}
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            {locale === "tr"
              ? "Sehir ici pratik araclardan aile yolculuklarina kadar her senaryo icin duzenlenmis koleksiyonlar."
              : "Curated collections for everything from city trips to family road journeys."}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`/${locale}/search?type=${cat.key}`}
              className="group border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(29,17,56,0.08)]"
            >
              <div className="flex h-16 w-16 items-center justify-center border border-gray-200 bg-gray-50 text-3xl">
                {cat.icon}
              </div>
              <div className="mt-5">
                <p className="text-lg font-bold text-[#1d1138]">{t(`home.${cat.key}`)}</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {locale === "tr" ? "Hizli kesif" : "Quick discovery"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
