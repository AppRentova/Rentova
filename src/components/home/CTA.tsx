"use client";

import Link from "next/link";
import { useCallback } from "react";
import { Button } from "@/components/ui";

function lookup(messages: Record<string, any>, key: string): string {
  let value: any = messages;
  for (const k of key.split(".")) {
    value = value?.[k];
  }
  return typeof value === "string" ? value : key;
}

interface CTAProps {
  messages: Record<string, any>;
  locale: string;
}

export function CTA({ messages, locale }: CTAProps) {
  const t = useCallback((key: string) => lookup(messages, key), [messages]);

  return (
    <section className="bg-white py-20 dark:bg-[#0b0b10]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden border border-[#130f1f]/15 bg-[#130f1f] text-white shadow-[18px_18px_0_rgba(19,15,31,0.10)] dark:border-white/10">
          <div className="absolute right-0 top-0 hidden h-full w-1/2 lg:block">
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1400&q=82"
              alt="Rentova arac sahibi akisi"
              className="h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#130f1f,rgba(19,15,31,0.28))]" />
          </div>

          <div className="relative z-10 max-w-2xl px-6 py-14 sm:px-10 lg:px-14 lg:py-20">
            <span className="inline-flex border border-white/20 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-white/70">
              {locale === "tr" ? "Arac sahibi misin?" : "Do you own a car?"}
            </span>
            <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
              {t("home.cta_title")}
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/75">{t("home.cta_desc")}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${locale}/list-your-car`}>
                <Button size="lg" className="w-full rounded-none border border-white bg-white px-6 py-3 text-base font-black text-[#130f1f] hover:bg-transparent hover:text-white sm:w-auto">
                  {t("home.cta_button")}
                </Button>
              </Link>
              <Link href={`/${locale}/search`}>
                <button className="w-full border border-white/25 bg-white/5 px-6 py-3 text-base font-black text-white transition hover:bg-white/10 sm:w-auto">
                  {locale === "tr" ? "Araclari kesfet" : "Browse cars"}
                </button>
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { value: "15 dk", label: locale === "tr" ? "ilan kurulumu" : "listing setup" },
                { value: "%25", label: locale === "tr" ? "net komisyon" : "service fee" },
                { value: "7/24", label: locale === "tr" ? "destek akisi" : "support flow" },
              ].map((item) => (
                <div key={item.label} className="border border-white/15 bg-white/5 p-4">
                  <p className="text-3xl font-black tracking-tight">{item.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
