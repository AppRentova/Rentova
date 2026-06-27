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
  { key: "city", icon: "🚗", tone: "from-sky-50 to-blue-100 text-sky-700" },
  { key: "commercial", icon: "🚚", tone: "from-emerald-50 to-green-100 text-emerald-700" },
  { key: "family", icon: "🚐", tone: "from-orange-50 to-amber-100 text-orange-700" },
  { key: "suv", icon: "🚙", tone: "from-violet-50 to-purple-100 text-violet-700" },
];

export function CarCategories({ messages, locale }: CarCategoriesProps) {
  const t = useCallback((key: string) => lookup(messages, key), [messages]);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-gray-200 bg-white px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-gray-500 shadow-sm">
            {t("home.categories_title")}
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-[#1d1138] sm:text-4xl">
            {locale === "tr" ? "İhtiyacına uygun aracı seç" : "Choose a car for every plan"}
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            {locale === "tr"
              ? "Şehir içi pratik araçlardan aile yolculuklarına kadar her senaryo için düzenlenmiş koleksiyonlar."
              : "Curated collections for everything from city trips to family road journeys."}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`/${locale}/search?type=${cat.key}`}
              className="group rounded-[28px] border border-gray-100 bg-white p-6 shadow-[0_18px_60px_rgba(29,17,56,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(29,17,56,0.1)]"
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.tone} text-3xl shadow-sm transition group-hover:scale-105`}>
                {cat.icon}
              </div>
              <div className="mt-5">
                <p className="text-lg font-bold text-[#1d1138]">{t(`home.${cat.key}`)}</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {locale === "tr" ? "Hızlı keşif" : "Quick discovery"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
