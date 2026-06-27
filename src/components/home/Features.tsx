"use client";

import { useCallback } from "react";

function lookup(messages: Record<string, any>, key: string): string {
  let value: any = messages;
  for (const k of key.split(".")) {
    value = value?.[k];
  }
  return typeof value === "string" ? value : key;
}

interface FeaturesProps {
  messages: Record<string, any>;
}

export function Features({ messages }: FeaturesProps) {
  const t = useCallback((key: string) => lookup(messages, key), [messages]);
  const features = [
    {
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t("home.feature_hourly"),
      desc: t("home.feature_hourly_desc"),
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: t("home.feature_no_wait"),
      desc: t("home.feature_no_wait_desc"),
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: t("home.feature_app"),
      desc: t("home.feature_app_desc"),
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-none border border-gray-200 bg-white px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
            {t("home.how_it_works")}
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-[#1d1138] sm:text-4xl">
            {t("home.featured_title")}
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">{t("home.featured_subtitle")}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <div key={i} className="group border border-gray-200 bg-white p-8 shadow-[0_18px_50px_rgba(29,17,56,0.06)]">
              <div className="inline-flex h-16 w-16 items-center justify-center border border-gray-200 bg-gray-50 text-[var(--primary-purple)]">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl font-bold text-[#1d1138]">{feature.title}</h3>
              <p className="mt-3 leading-7 text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 border border-gray-200 bg-[#1d1138] px-6 py-5 text-white">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-2xl font-black text-white">24/7</p>
              <p className="mt-1 text-sm text-white/75">Kesintisiz arac bul ve listele</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">Anlik</p>
              <p className="mt-1 text-sm text-white/75">Rezervasyon ve onay akisleri</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">Yerel</p>
              <p className="mt-1 text-sm text-white/75">Turkiye sehirlerine gore optimize edildi</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
