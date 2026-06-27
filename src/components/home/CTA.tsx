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
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#1d1138,#2b1657_55%,#b400b4)] px-6 py-14 text-white shadow-[0_30px_80px_rgba(29,17,56,0.22)] sm:px-10 lg:px-16">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -left-8 top-0 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute right-0 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-black/20 blur-3xl" />
          </div>

          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                {locale === "tr" ? "Araç sahibi misin?" : "Do you own a car?"}
              </span>
              <h2 className="mt-5 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
                {t("home.cta_title")}
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">
                {t("home.cta_desc")}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-start lg:justify-end">
              <Link href={`/${locale}/list-your-car`}>
                <Button
                  size="lg"
                  className="w-full rounded-2xl bg-white px-6 py-3 text-base font-bold text-[#1d1138] hover:bg-gray-100 sm:w-auto"
                >
                  {t("home.cta_button")}
                </Button>
              </Link>
              <Link href={`/${locale}/search`}>
                <button className="w-full rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-base font-bold text-white backdrop-blur transition hover:bg-white/15 sm:w-auto">
                  {locale === "tr" ? "Araçları keşfet" : "Browse cars"}
                </button>
              </Link>
            </div>
          </div>

          <div className="relative mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { value: "15 dk", label: locale === "tr" ? "İlan açılışı" : "Listing setup" },
              { value: "%25", label: locale === "tr" ? "Komisyon" : "Service fee" },
              { value: "7/24", label: locale === "tr" ? "Destek planı" : "Support window" },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-2xl font-black">{item.value}</p>
                <p className="mt-1 text-sm text-white/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
