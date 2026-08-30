"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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

function Icon({ name }: { name: "car" | "search" | "calendar" | "message" | "menu" | "close" }) {
  const paths = {
    car: "M5 17h14l-1.4-5.2A3 3 0 0014.7 9H9.3a3 3 0 00-2.9 2.8L5 17zm2 0v2m10-2v2M7.5 14h.01M16.5 14h.01M8 9l1-3h6l1 3",
    search: "M11 19a8 8 0 100-16 8 8 0 000 16zm6-2l4 4",
    calendar: "M6 6h12v14H6V6zm3-3v5m6-5v5M9 13h6",
    message: "M4 5h16v11H8l-4 4V5z",
    menu: "M4 7h16M4 12h16M4 17h16",
    close: "M6 6l12 12M18 6L6 18",
  };

  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[name]} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Header({ messages, locale, session }: HeaderProps) {
  const t = useCallback((key: string) => lookup(messages, key), [messages]);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = useCallback(() => {
    const newLocale = locale === "tr" ? "en" : "tr";
    document.cookie = `rentova_locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    const newPath = (pathname || `/${locale}`).replace(/^\/(tr|en)(?=\/|$)/, `/${newLocale}`);
    router.push(newPath);
    router.refresh();
  }, [locale, pathname, router]);

  const handleLogout = useCallback(async () => {
    setMenuOpen(false);
    await fetch("/api/auth/logout");
    router.push(`/${locale}/auth/login`);
    router.refresh();
  }, [locale, router]);

  const navItem =
    "flex items-center gap-2 rounded-lg px-3 py-2 font-[var(--font-body)] text-sm font-semibold text-[#4b4451] transition hover:bg-[#f6f3f2] hover:text-[#4d187d] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white";

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-[#fcf9f8] px-5 py-4 shadow-sm transition-colors dark:bg-[#121212] md:px-16">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <span className="text-[#4d187d] dark:text-[#dcb8ff]">
            <Icon name="car" />
          </span>
          <span className="font-[var(--font-heading)] text-2xl font-bold text-[#4d187d] dark:text-[#dcb8ff]">
            Rentova
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link className={`${navItem} text-[#4d187d]`} href={`/${locale}/search`}>
            <Icon name="search" />
            Kesfet
          </Link>
          <Link className={navItem} href={session ? `/${locale}/trips` : `/${locale}/auth/login`}>
            <Icon name="calendar" />
            Rezervasyonlar
          </Link>
          <Link className={navItem} href={session ? `/${locale}/messages` : `/${locale}/auth/login`}>
            <Icon name="message" />
            Mesajlar
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <Link href={`/${locale}/dashboard`} className="rounded-lg px-3 py-2 text-sm font-semibold text-[#4b4451] hover:bg-[#f6f3f2] dark:text-white/70 dark:hover:bg-white/10">
              Panelim
            </Link>
          ) : (
            <Link href={`/${locale}/auth/login`} className="rounded-lg px-3 py-2 text-sm font-semibold text-[#4b4451] hover:bg-[#f6f3f2] dark:text-white/70 dark:hover:bg-white/10">
              {t("nav.login") || "Giris Yap"}
            </Link>
          )}
          <Link href={`/${locale}/list-your-car`} className="rounded-xl bg-[#653496] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#4d187d] active:scale-[0.98]">
            {t("nav.list_your_car") || "Aracini Kirala"}
          </Link>
          <button
            type="button"
            onClick={switchLocale}
            className="rounded-lg border border-[#cec3d2] px-3 py-2 text-sm font-semibold text-[#4b4451] transition hover:border-[#653496] hover:text-[#653496] dark:border-white/10 dark:text-white/70"
            aria-label="Switch language"
          >
            {locale === "tr" ? "EN" : "TR"}
          </button>
          <ThemeToggle />
        </div>

        <button
          className="rounded-full p-2 text-[#4b4451] active:scale-95 dark:text-white/70 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
      </div>

      {menuOpen && (
        <div className="mt-4 rounded-xl border border-[#cec3d2] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-[#1e1e1f] md:hidden">
          <div className="grid gap-2">
            <Link href={`/${locale}/search`} className={navItem} onClick={() => setMenuOpen(false)}>
              Kesfet
            </Link>
            <Link href={session ? `/${locale}/trips` : `/${locale}/auth/login`} className={navItem} onClick={() => setMenuOpen(false)}>
              Rezervasyonlar
            </Link>
            <Link href={session ? `/${locale}/messages` : `/${locale}/auth/login`} className={navItem} onClick={() => setMenuOpen(false)}>
              Mesajlar
            </Link>
            <Link href={`/${locale}/list-your-car`} className="rounded-xl bg-[#653496] px-4 py-3 text-sm font-bold text-white" onClick={() => setMenuOpen(false)}>
              Aracini Kirala
            </Link>
            {session ? (
              <button type="button" onClick={handleLogout} className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#4b4451] dark:text-white/70">
                Cikis Yap
              </button>
            ) : (
              <Link href={`/${locale}/auth/login`} className={navItem} onClick={() => setMenuOpen(false)}>
                Giris Yap
              </Link>
            )}
            <div className="flex items-center gap-3 pt-2">
              <button type="button" onClick={switchLocale} className="rounded-lg border border-[#cec3d2] px-3 py-2 text-sm font-semibold">
                {locale === "tr" ? "EN" : "TR"}
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
