import Link from "next/link";

const footerLinks = [
  { label: "Ara", href: "/search" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Profil", href: "/dashboard/profile" },
  { label: "Ayarlar", href: "/dashboard/settings" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-2">
        <div>
          <p className="font-display text-xl font-semibold">Rentova</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Getaround benzeri, Türkiye pazarı için temiz, hızlı ve modern araç kiralama deneyimi.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 md:justify-end">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-muted-foreground transition hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

