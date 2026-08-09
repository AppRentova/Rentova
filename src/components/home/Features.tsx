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
  "https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=1100&q=80";

export function Features({ messages }: FeaturesProps) {
  const t = useCallback((key: string) => lookup(messages, key), [messages]);
  const features = [
    {
      icon: ":-)",
      title: t("home.feature_hourly"),
      desc: t("home.feature_hourly_desc"),
    },
    {
      icon: "[]",
      title: t("home.feature_no_wait"),
      desc: t("home.feature_no_wait_desc"),
    },
    {
      icon: "car",
      title: t("home.feature_app"),
      desc: t("home.feature_app_desc"),
    },
  ];

  return (
    <section className="border-y border-gray-100 bg-white py-24 dark:border-white/10 dark:bg-[#0c0c12]">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="group overflow-hidden border border-gray-200 bg-gray-100 shadow-[0_24px_70px_rgba(17,24,39,0.10)] dark:border-white/10 dark:bg-white/10">
          <img src={visualImage} alt="People picking up a shared rental car" className="h-full min-h-[420px] w-full object-cover transition duration-700 group-hover:scale-105" />
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="max-w-xl text-4xl font-black leading-tight text-[#1d1138] dark:text-white sm:text-5xl">
            Discover the new way <span className="block text-[var(--primary-purple)]">to rent a car</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-700 dark:text-gray-300">
            Choose from cars available from private and professional owners near you. Search, book, unlock and return from one flow.
          </p>

          <div className="mt-8 space-y-6">
            {features.map((feature) => (
              <div key={feature.title} className="grid grid-cols-[40px_1fr] gap-4 transition hover:translate-x-1">
                <div className="flex h-10 w-10 items-center justify-center border border-[var(--primary-purple)] text-xs font-black text-[var(--primary-purple)] transition hover:bg-[var(--primary-purple)] hover:text-white">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#1d1138] dark:text-white">{feature.title}</h3>
                  <p className="mt-2 leading-7 text-gray-700 dark:text-gray-300">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href="#categories"
            className="mt-8 inline-flex w-fit items-center gap-3 border-2 border-[var(--primary-purple)] px-8 py-4 text-base font-extrabold text-[var(--primary-purple)] transition hover:bg-[var(--primary-purple)] hover:text-white"
          >
            See how it works
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
