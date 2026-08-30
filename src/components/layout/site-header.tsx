import Link from "next/link";
import { CarFront, Grid2x2, Search, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/search", label: "Ara" },
  { href: "/list-your-car", label: "Aracını listele" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className={cn("mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4", compact && "py-3")}>
        <Link href="/" className="flex items-center gap-3 font-display text-lg font-semibold tracking-tight">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-brand-foreground shadow-glow">
            <CarFront size={20} />
          </span>
          <span>
            Rentova
            <span className="block text-xs font-normal text-muted-foreground">Türkiye için araç kiralama</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-muted-foreground lg:flex">
            <Search size={16} />
            <span>İstanbul, Beşiktaş</span>
          </div>
          <ThemeToggle />
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            <Grid2x2 size={16} />
            Giriş
          </Button>
          <Button size="sm" className="hidden sm:inline-flex">
            <Sparkles size={16} />
            Kaydol
          </Button>
        </div>
      </div>
    </header>
  );
}

