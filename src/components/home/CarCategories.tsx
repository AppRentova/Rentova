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
  { key: "city", icon: "🚗", color: "bg-blue-50 text-blue-600" },
  { key: "commercial", icon: "🚐", color: "bg-green-50 text-green-600" },
  { key: "family", icon: "🚙", color: "bg-orange-50 text-orange-600" },
  { key: "suv", icon: "🚘", color: "bg-purple-50 text-purple-600" },
];

export function CarCategories({ messages, locale }: CarCategoriesProps) {
  const t = useCallback((key: string) => lookup(messages, key), [messages]);
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          {t("home.categories_title")}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`/${locale}/search?type=${cat.key}`}
              className="flex flex-col items-center gap-3 p-8 rounded-sm bg-white border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className={`inline-flex items-center justify-center w-14 h-14 rounded-sm text-2xl ${cat.color}`}>
                {cat.icon}
              </span>
              <span className="font-medium text-gray-900">{t(`home.${cat.key}`)}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
