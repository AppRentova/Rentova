"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:-translate-y-0.5 hover:shadow-glow"
      aria-label="Tema değiştir"
    >
      {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
      <span>{theme === "dark" ? "Açık tema" : "Koyu tema"}</span>
    </button>
  );
}

