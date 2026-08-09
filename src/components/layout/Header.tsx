"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

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
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    setMenuOpen(false);
    await fetch("/api/auth/logout");
    router.push(`/${locale}/auth/login`);
    router.refresh();
  }, [locale, router]);

  const navLinkClass =
    "text-sm font-semibold text-gray-700 transition-colors hover:text-[var(--primary-purple)] dark:text-gray-200";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#101018]/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-[var(--primary-purple)]">rentova</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {session ? (
            <Link href={`/${locale}/dashboard`} className={navLinkClass}>
              {t("nav.dashboard")}
            </Link>
          ) : (
            <Link href={`/${locale}/auth/login`} className={navLinkClass}>
              {t("nav.login") || "Log in"}
            </Link>
          )}

          <Link href="#" className={navLinkClass}>
            {t("nav.help") || "Questions?"}
          </Link>

          <Link href="#" className={navLinkClass}>
            Blog
          </Link>

          <Link href={`/${locale}/list-your-car`}>
            <button className="rounded-sm border-2 border-[var(--primary-purple)] px-5 py-1.5 text-sm font-semibold text-[var(--primary-purple)] transition-all hover:bg-[var(--primary-purple)] hover:text-white">
              {t("nav.list_your_car") || "List your car"}
            </button>
          </Link>

          <ThemeToggle />
        </div>

        <button
          className="p-2 text-gray-700 dark:text-gray-200 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 bg-white dark:border-white/10 dark:bg-[#101018] md:hidden">
          <div className="space-y-3 px-6 py-4">
            <div className="pb-2">
              <ThemeToggle />
            </div>
            <Link href={`/${locale}/search`} className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-200" onClick={() => setMenuOpen(false)}>
              {t("nav.rent_a_car")}
            </Link>
            <Link href={`/${locale}/list-your-car`} className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-200" onClick={() => setMenuOpen(false)}>
              {t("nav.list_your_car")}
            </Link>
            <hr className="border-gray-100 dark:border-white/10" />
            {session ? (
              <>
                <Link href={`/${locale}/dashboard`} className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-200" onClick={() => setMenuOpen(false)}>
                  {t("nav.dashboard")}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link href={`/${locale}/auth/login`} className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-200" onClick={() => setMenuOpen(false)}>
                  {t("nav.login")}
                </Link>
                <Link href={`/${locale}/auth/register`} className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-200" onClick={() => setMenuOpen(false)}>
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
