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

const visualImage =
  "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1300&q=82";

export function Features({ messages }: FeaturesProps) {
  const t = useCallback((key: string) => lookup(messages, key), [messages]);
  const features = [
    {
      number: "01",
      title: t("home.feature_hourly"),
      desc: t("home.feature_hourly_desc"),
    },
    {
      number: "02",
      title: t("home.feature_no_wait"),
      desc: t("home.feature_no_wait_desc"),
    },
    {
      number: "03",
      title: t("home.feature_app"),
      desc: t("home.feature_app_desc"),
    },
  ];

  return (
    <section className="border-y border-[#130f1f]/10 bg-white py-20 dark:border-white/10 dark:bg-[#0b0b10]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="group relative min-h-[520px] overflow-hidden border border-[#130f1f]/15 bg-[#f4f1ea] dark:border-white/10 dark:bg-white/5">
          <img src={visualImage} alt="Rentova arac teslim deneyimi" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute bottom-5 left-5 right-5 border border-white/20 bg-white/90 p-5 text-[#130f1f] backdrop-blur dark:bg-[#0b0b10]/85 dark:text-white">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#653496]">Designed for Turkey</p>
            <p className="mt-2 text-2xl font-black tracking-tight">Yakindaki arac, net fiyat, hizli cikis.</p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="w-fit border border-[#130f1f]/15 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-[#5b5668] dark:border-white/10 dark:text-white/55">
            Rentova Flow
          </p>
          <h2 className="mt-5 max-w-2xl text-4xl font-black leading-[1.02] tracking-[-0.04em] text-[#130f1f] dark:text-white sm:text-6xl">
            Kiralama akisi daha kisa, karar vermek daha kolay.
          </h2>

          <div className="mt-10 divide-y divide-[#130f1f]/10 border-y border-[#130f1f]/10 dark:divide-white/10 dark:border-white/10">
            {features.map((feature) => (
              <div key={feature.number} className="grid gap-4 py-6 transition hover:bg-[#f8f6f1] dark:hover:bg-white/5 sm:grid-cols-[72px_1fr]">
                <div className="text-sm font-black text-[#653496]">{feature.number}</div>
                <div>
                  <h3 className="text-xl font-black text-[#130f1f] dark:text-white">{feature.title}</h3>
                  <p className="mt-2 max-w-2xl leading-7 text-[#5b5668] dark:text-white/65">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href="#categories"
            className="mt-8 inline-flex w-fit items-center gap-3 border border-[#130f1f] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#130f1f] transition hover:-translate-y-0.5 hover:bg-[#130f1f] hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-[#130f1f]"
          >
            Nasil calisir
            <span aria-hidden>+</span>
          </a>
        </div>
      </div>
    </section>
  );
}
