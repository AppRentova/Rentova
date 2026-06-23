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
    <section className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold">{t("home.cta_title")}</h2>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          {t("home.cta_desc")}
        </p>
        <div className="mt-8">
          <Link href={`/${locale}/list-your-car`}>
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              {t("home.cta_button")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
