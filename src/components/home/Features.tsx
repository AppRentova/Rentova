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
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fcf9ff] to-white" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-[rgba(180,0,180,0.15)] bg-white px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-[var(--primary-purple)] shadow-sm">
            {t("home.how_it_works")}
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-[#1d1138] sm:text-4xl">
            {t("home.featured_title")}
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">{t("home.featured_subtitle")}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-[28px] border border-gray-100 bg-white p-8 shadow-[0_18px_60px_rgba(29,17,56,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(29,17,56,0.12)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,0,180,0.1),transparent_42%)] opacity-0 transition group-hover:opacity-100" />
              <div className="relative">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(180,0,180,0.12),rgba(109,46,240,0.1))] text-[var(--primary-purple)]">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-xl font-bold text-[#1d1138]">{feature.title}</h3>
                <p className="mt-3 leading-7 text-gray-600">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[28px] border border-gray-100 bg-[#1d1138] px-6 py-5 text-white shadow-[0_18px_60px_rgba(29,17,56,0.15)]">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-2xl font-black text-[var(--primary-purple)]">24/7</p>
              <p className="mt-1 text-sm text-white/75">Kesintisiz araç bul ve listele</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[var(--primary-purple)]">Anlık</p>
              <p className="mt-1 text-sm text-white/75">Rezervasyon ve onay akışları</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[var(--primary-purple)]">Yerel</p>
              <p className="mt-1 text-sm text-white/75">Türkiye şehirlerine göre optimize edildi</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
