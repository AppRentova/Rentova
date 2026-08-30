import Link from "next/link";
import { Bell, CarFront, CreditCard, Home, MessageSquare, Settings, Shield, User, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Genel Bakış", icon: Home },
  { href: "/dashboard/trips", label: "Seyahatlerim", icon: MapPin },
  { href: "/dashboard/messages", label: "Mesajlar", icon: MessageSquare },
  { href: "/dashboard/cars", label: "Araçlarım", icon: CarFront },
  { href: "/dashboard/profile", label: "Profil", icon: User },
  { href: "/dashboard/payment-methods", label: "Ödemeler", icon: CreditCard },
  { href: "/dashboard/notifications", label: "Bildirimler", icon: Bell },
  { href: "/dashboard/settings", label: "Ayarlar", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-[2rem] border border-border bg-card p-4 shadow-sm">
        <div className="rounded-[1.5rem] bg-brand p-5 text-brand-foreground">
          <p className="text-sm uppercase tracking-[0.2em] opacity-80">Hesap</p>
          <p className="mt-2 font-display text-2xl font-semibold">Arsen Demir</p>
          <p className="mt-1 text-sm opacity-90">Pro kullanıcı · doğrulanmış profil</p>
        </div>
        <nav className="mt-4 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-muted",
                item.href === "/dashboard" ? "bg-muted" : "text-muted-foreground"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4 rounded-[1.5rem] border border-border bg-muted p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Shield size={16} className="text-brand" /> Güvenlik
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Kimlik doğrulama, ödeme güvenliği ve mesaj güvenliği aktif.
          </p>
        </div>
      </aside>
      <section>{children}</section>
    </div>
  );
}

