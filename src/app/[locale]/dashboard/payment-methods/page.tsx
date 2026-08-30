import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PaymentMethodsPage({ params }: { params: Promise<{ locale: string }> }) {
  const session = await getSession();
  const { locale } = await params;

  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-4 py-24 text-[#130f1f] dark:bg-[#0b0b10] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#653496]">Payments</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">Odeme yontemleri</h1>
          <p className="mt-3 max-w-xl text-[#5b5668] dark:text-white/60">
            Rezervasyon sirasinda kullanilacak kartlarini burada yonet. Canli odeme altyapisi baglandiginda bu ekran Stripe/iyzico akisiyle calisacak.
          </p>

          <div className="mt-8 border border-[#130f1f]/10 bg-[#130f1f] p-6 text-white dark:border-white/10">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-white/45">Varsayilan kart</p>
            <p className="mt-8 text-2xl font-black tracking-[0.12em]">**** **** **** 4242</p>
            <div className="mt-8 flex items-end justify-between">
              <span>
                <span className="block text-xs uppercase tracking-[0.2em] text-white/45">Kart sahibi</span>
                <span className="font-black">Rentova User</span>
              </span>
              <span className="text-xl font-black">VISA</span>
            </div>
          </div>
        </section>

        <section className="border border-[#130f1f]/10 bg-white p-6 dark:border-white/10 dark:bg-[#12121a]">
          <h2 className="text-2xl font-black">Yeni kart ekle</h2>
          <form className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#6d6878] dark:text-white/45">Kart numarasi</span>
              <input className="h-12 border border-[#130f1f]/15 bg-[#f8f6f1] px-4 outline-none focus:border-[#653496] dark:border-white/10 dark:bg-[#0f0f16]" placeholder="4242 4242 4242 4242" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#6d6878] dark:text-white/45">Son kullanma</span>
                <input className="h-12 border border-[#130f1f]/15 bg-[#f8f6f1] px-4 outline-none focus:border-[#653496] dark:border-white/10 dark:bg-[#0f0f16]" placeholder="08/29" />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#6d6878] dark:text-white/45">CVC</span>
                <input className="h-12 border border-[#130f1f]/15 bg-[#f8f6f1] px-4 outline-none focus:border-[#653496] dark:border-white/10 dark:bg-[#0f0f16]" placeholder="123" />
              </label>
            </div>
            <button type="button" className="mt-2 h-12 border border-[#130f1f] bg-[#130f1f] text-sm font-black text-white transition hover:bg-white hover:text-[#130f1f] dark:border-white dark:bg-white dark:text-[#130f1f] dark:hover:bg-transparent dark:hover:text-white">
              Karti kaydet
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
