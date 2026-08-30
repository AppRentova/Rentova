import Link from "next/link";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function TripsPage({ params }: { params: Promise<{ locale: string }> }) {
  const session = await getSession();
  const { locale } = await params;

  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select(
      `id, startDate:start_date, endDate:end_date, totalPrice:total_price, status,
       car:cars(id, brand, model, year, city, images:car_images(id, url, is_primary))`,
    )
    .eq("renter_id", session.userId)
    .order("created_at", { ascending: false });

  const trips = data || [];

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-4 py-24 text-[#130f1f] dark:bg-[#0b0b10] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 border-b border-[#130f1f]/10 pb-6 dark:border-white/10 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#653496]">Trips</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">Seyahatlerim</h1>
          </div>
          <Link href={`/${locale}/search`} className="border border-[#130f1f] bg-[#130f1f] px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-[#130f1f] dark:border-white dark:bg-white dark:text-[#130f1f] dark:hover:bg-transparent dark:hover:text-white">
            Yeni arac bul
          </Link>
        </div>

        {trips.length === 0 ? (
          <section className="mt-8 border border-[#130f1f]/10 bg-white p-10 text-center dark:border-white/10 dark:bg-[#12121a]">
            <h2 className="text-2xl font-black">Henuz seyahatin yok</h2>
            <p className="mx-auto mt-3 max-w-xl text-[#5b5668] dark:text-white/60">
              Arac arama sayfasindan rezervasyon yaptiginda aktif, gecmis ve iptal edilen seyahatlerin burada gorunecek.
            </p>
          </section>
        ) : (
          <div className="mt-8 grid gap-4">
            {trips.map((trip: any) => {
              const image = trip.car?.images?.[0]?.url;
              return (
                <article key={trip.id} className="grid gap-4 border border-[#130f1f]/10 bg-white p-4 dark:border-white/10 dark:bg-[#12121a] sm:grid-cols-[180px_1fr_auto] sm:items-center">
                  <div className="aspect-[4/3] bg-[#ebe8df]">
                    {image && <img src={image} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#653496]">{trip.status}</p>
                    <h2 className="mt-2 text-xl font-black">
                      {trip.car?.brand} {trip.car?.model} ({trip.car?.year})
                    </h2>
                    <p className="mt-1 text-sm text-[#5b5668] dark:text-white/60">
                      {new Date(trip.startDate).toLocaleString("tr-TR")} - {new Date(trip.endDate).toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <p className="text-2xl font-black">{Number(trip.totalPrice || 0).toLocaleString("tr-TR")} TL</p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
