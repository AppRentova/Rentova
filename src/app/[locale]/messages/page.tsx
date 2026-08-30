import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const conversations = [
  {
    name: "Mert Kaya",
    car: "Peugeot 208",
    message: "Arac Kadikoy lokasyonunda hazir. Rezervasyon saatinden 10 dk once yazabilirsiniz.",
    time: "14:20",
    unread: true,
  },
  {
    name: "Ece Demir",
    car: "Renault Clio",
    message: "Teslim noktasini rezervasyon onayindan sonra paylasacagim.",
    time: "Dun",
    unread: false,
  },
  {
    name: "Rentova Destek",
    car: "Guvenlik kontrolu",
    message: "Kimlik ve ehliyet dogrulama adimini panelden tamamlayabilirsiniz.",
    time: "Pzt",
    unread: false,
  },
];

export default async function MessagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const session = await getSession();
  const { locale } = await params;

  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-4 py-24 text-[#130f1f] dark:bg-[#0b0b10] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 border-b border-[#130f1f]/10 pb-6 dark:border-white/10 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#653496]">Inbox</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">Mesajlar</h1>
          </div>
          <Link href={`/${locale}/dashboard`} className="border border-[#130f1f]/15 bg-white px-4 py-3 text-sm font-black transition hover:bg-[#130f1f] hover:text-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white dark:hover:text-[#130f1f]">
            Panele don
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="border border-[#130f1f]/10 bg-white dark:border-white/10 dark:bg-[#12121a]">
            {conversations.map((conversation) => (
              <button key={conversation.name} className="flex w-full gap-4 border-b border-[#130f1f]/10 p-5 text-left transition hover:bg-[#f8f6f1] dark:border-white/10 dark:hover:bg-white/5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#130f1f] text-sm font-black text-white dark:bg-white dark:text-[#130f1f]">
                  {conversation.name.slice(0, 1)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-black">{conversation.name}</span>
                    <span className="text-xs text-[#6d6878] dark:text-white/50">{conversation.time}</span>
                  </span>
                  <span className="mt-1 block text-xs font-bold uppercase tracking-[0.16em] text-[#653496]">{conversation.car}</span>
                  <span className="mt-2 line-clamp-2 block text-sm leading-6 text-[#5b5668] dark:text-white/60">{conversation.message}</span>
                </span>
                {conversation.unread && <span className="mt-2 h-2.5 w-2.5 bg-[#653496]" aria-label="Okunmamis" />}
              </button>
            ))}
          </section>

          <section className="border border-[#130f1f]/10 bg-white p-6 dark:border-white/10 dark:bg-[#12121a]">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#653496]">Mert Kaya</p>
            <h2 className="mt-2 text-2xl font-black">Peugeot 208 rezervasyonu</h2>
            <div className="mt-8 space-y-4">
              <div className="max-w-[82%] border border-[#130f1f]/10 bg-[#f4f1ea] p-4 dark:border-white/10 dark:bg-white/5">
                Arac Kadikoy lokasyonunda hazir. Rezervasyon saatinden 10 dk once yazabilirsiniz.
              </div>
              <div className="ml-auto max-w-[82%] border border-[#130f1f] bg-[#130f1f] p-4 text-white dark:border-white dark:bg-white dark:text-[#130f1f]">
                Tesekkurler, teslimden once konum bildirimi geliyor mu?
              </div>
            </div>
            <form className="mt-8 flex gap-3">
              <input className="h-12 min-w-0 flex-1 border border-[#130f1f]/15 bg-[#f8f6f1] px-4 text-sm outline-none focus:border-[#653496] dark:border-white/10 dark:bg-[#0f0f16]" placeholder="Mesaj yaz..." />
              <button className="h-12 border border-[#130f1f] bg-[#130f1f] px-5 text-sm font-black text-white dark:border-white dark:bg-white dark:text-[#130f1f]">
                Gonder
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
