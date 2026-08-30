import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const rows = [
  { title: "Rezervasyon guncellemeleri", desc: "Onay, iptal ve teslim hatirlatmalari", enabled: true },
  { title: "Mesaj bildirimleri", desc: "Arac sahibi veya kiracidan yeni mesaj geldiginde haber ver", enabled: true },
  { title: "Fiyat ve kampanya", desc: "Sehir bazli firsatlar ve yeni arac onerileri", enabled: false },
  { title: "Guvenlik uyarilari", desc: "Sifre, oturum ve hesap hareketleri", enabled: true },
];

export default async function NotificationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const session = await getSession();
  const { locale } = await params;

  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-4 py-24 text-[#130f1f] dark:bg-[#0b0b10] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#653496]">Notifications</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">Bildirim ayarlari</h1>

        <div className="mt-8 border border-[#130f1f]/10 bg-white dark:border-white/10 dark:bg-[#12121a]">
          {rows.map(({ title, desc, enabled }) => (
            <label key={title} className="flex cursor-pointer items-center justify-between gap-5 border-b border-[#130f1f]/10 p-5 dark:border-white/10">
              <span>
                <span className="block font-black">{title}</span>
                <span className="mt-1 block text-sm text-[#5b5668] dark:text-white/60">{desc}</span>
              </span>
              <input type="checkbox" defaultChecked={Boolean(enabled)} className="h-5 w-5 accent-[#653496]" />
            </label>
          ))}
        </div>
      </div>
    </main>
  );
}
