import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const session = await getSession();
  const { locale } = await params;

  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  const supabase = await createClient();
  const [{ count: bookingsCount }, { count: carsCount }, { count: activeBookings }] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("renter_id", session.userId),
    supabase.from("cars").select("*", { count: "exact", head: true }).eq("owner_id", session.userId),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("renter_id", session.userId)
      .in("status", ["CONFIRMED", "ACTIVE"]),
  ]);

  const links = [
    ["Rezervasyonlarim", "Tum rezervasyonlarini goruntule", `/${locale}/dashboard/bookings`],
    ["Seyahatlerim", "Aktif ve gecmis kiralama akislari", `/${locale}/trips`],
    ["Araclarim", "Arac ilanlarini yonet", `/${locale}/dashboard/cars`],
    ["Profil", "Profil ve fotograf bilgilerini duzenle", `/${locale}/dashboard/profile`],
    ["Mesajlar", "Kiraci ve arac sahibi gorusmeleri", `/${locale}/messages`],
    ["Ayarlar", "Bildirim, odeme ve guvenlik tercihleri", `/${locale}/dashboard/settings`],
    ["Arac Ekle", "Yeni bir arac listele", `/${locale}/list-your-car`],
  ];

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-4 py-24 text-[#130f1f] dark:bg-[#0b0b10] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-[#130f1f]/10 pb-8 dark:border-white/10">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#653496]">Rentova Panel</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">Panelim</h1>
          <p className="mt-3 max-w-2xl text-[#5b5668] dark:text-white/60">
            Rezervasyonlarini, arac ilanlarini, profilini ve hesap ayarlarini tek yerden yonet.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            [bookingsCount ?? 0, "Toplam rezervasyon"],
            [activeBookings ?? 0, "Aktif rezervasyon"],
            [carsCount ?? 0, "Listelenen arac"],
          ].map(([value, label]) => (
            <div key={label} className="border border-[#130f1f]/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#12121a]">
              <p className="text-4xl font-black tracking-tight">{value}</p>
              <p className="mt-1 text-sm text-[#5b5668] dark:text-white/60">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {links.map(([title, desc, href]) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between gap-5 border border-[#130f1f]/10 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[10px_10px_0_rgba(19,15,31,0.10)] dark:border-white/10 dark:bg-[#12121a]"
            >
              <span>
                <span className="block text-lg font-black">{title}</span>
                <span className="mt-1 block text-sm text-[#5b5668] dark:text-white/60">{desc}</span>
              </span>
              <span className="text-2xl">+</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
