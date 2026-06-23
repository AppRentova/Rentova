"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui";

function lookup(messages: Record<string, any>, key: string): string {
  let value: any = messages;
  for (const k of key.split(".")) {
    value = value?.[k];
  }
  return typeof value === "string" ? value : key;
}

interface HeaderProps {
  messages: Record<string, any>;
  locale: string;
  session?: { userId: string; role: string } | null;
}

export function Header({ messages, locale, session }: HeaderProps) {
  const t = useCallback((key: string) => lookup(messages, key), [messages]);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-[var(--primary-purple)]">
            rentova
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {session ? (
            <Link
              href={`/${locale}/dashboard`}
              className="text-sm font-semibold text-gray-700 hover:text-[var(--primary-purple)] transition-colors"
            >
              {t("nav.dashboard")}
            </Link>
          ) : (
            <Link
              href={`/${locale}/auth/login`}
              className="text-sm font-semibold text-gray-700 hover:text-[var(--primary-purple)] transition-colors"
            >
              {t("nav.login") || "Log in"}
            </Link>
          )}

          <Link
            href="#"
            className="text-sm font-semibold text-gray-700 hover:text-[var(--primary-purple)] transition-colors"
          >
            {t("nav.help") || "Questions?"}
          </Link>

          <Link
            href="#"
            className="text-sm font-semibold text-gray-700 hover:text-[var(--primary-purple)] transition-colors"
          >
            Blog
          </Link>

          <Link href={`/${locale}/list-your-car`}>
            <button className="border-2 border-[var(--primary-purple)] text-[var(--primary-purple)] hover:bg-[var(--primary-purple)] hover:text-white transition-all font-semibold rounded-sm px-5 py-1.5 text-sm">
              {t("nav.list_your_car") || "List your car"}
            </button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-6 py-4 space-y-3">
            <Link href={`/${locale}/search`} className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>
              {t("nav.rent_a_car")}
            </Link>
            <Link href={`/${locale}/list-your-car`} className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>
              {t("nav.list_your_car")}
            </Link>
            <hr className="border-gray-100" />
            {session ? (
              <>
                <Link href={`/${locale}/dashboard`} className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>
                  {t("nav.dashboard")}
                </Link>
                <Link href={`/${locale}/api/auth/logout`} className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>
                  {t("nav.logout")}
                </Link>
              </>
            ) : (
              <>
                <Link href={`/${locale}/auth/login`} className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>
                  {t("nav.login")}
                </Link>
                <Link href={`/${locale}/auth/register`} className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>
                  {t("nav.register")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

