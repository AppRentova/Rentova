import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const settings = [
  { title: "Bildirimler", desc: "Rezervasyon, mesaj ve fiyat bildirimlerini yonet.", href: "notifications" },
  { title: "Odeme yontemleri", desc: "Kartlarini ve varsayilan odeme tercihini duzenle.", href: "payment-methods" },
  { title: "Guvenlik", desc: "Sifre, oturum ve dogrulama ayarlarini kontrol et.", href: "profile" },
];

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const session = await getSession();
  const { locale } = await params;

  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-4 py-24 text-[#130f1f] dark:bg-[#0b0b10] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#653496]">Account</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">Ayarlar</h1>
        <p className="mt-3 max-w-2xl text-[#5b5668] dark:text-white/60">
          Rentova hesabinin bildirim, odeme ve guvenlik tercihlerini buradan yonet.
        </p>

        <div className="mt-8 grid gap-4">
          {settings.map((item) => (
            <Link key={item.href} href={`/${locale}/dashboard/${item.href}`} className="flex items-center justify-between gap-5 border border-[#130f1f]/10 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[10px_10px_0_rgba(19,15,31,0.10)] dark:border-white/10 dark:bg-[#12121a]">
              <span>
                <span className="block text-xl font-black">{item.title}</span>
                <span className="mt-1 block text-sm text-[#5b5668] dark:text-white/60">{item.desc}</span>
              </span>
              <span className="text-2xl">+</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
