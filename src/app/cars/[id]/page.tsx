import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cars } from "@/lib/mock-data";
import { CalendarDays, CheckCircle2, MapPin, ShieldCheck, Star } from "lucide-react";
import { BookingWidget } from "@/components/search/booking-widget";

export function generateStaticParams() {
  return cars.map((car) => ({ id: car.id }));
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = cars.find((entry) => entry.id === id);
  if (!car) notFound();

  return (
    <AppShell compact>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={car.image} alt={`${car.brand} ${car.model}`} className="h-full w-full object-cover" />
              </div>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{car.city}</Badge>
                  <Badge>{car.transmission}</Badge>
                  <Badge>{car.fuel}</Badge>
                  <Badge>{car.rating} ★</Badge>
                </div>
                <div>
                  <h1 className="font-display text-4xl font-semibold">
                    {car.brand} {car.model}
                  </h1>
                  <p className="mt-2 text-muted-foreground">{car.description}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <Feature label="Konum" value={car.address} icon={<MapPin size={16} />} />
                  <Feature label="Sahip" value={car.host} icon={<CheckCircle2 size={16} />} />
                  <Feature label="Mesafe" value={`${car.distanceKm} km`} icon={<ShieldCheck size={16} />} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-display text-2xl font-semibold">Özellikler</h2>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    `Yıl: ${car.year}`,
                    `${car.seats} koltuk`,
                    "GPS konumlu teslimat",
                    "Anında rezervasyon",
                    "İç/dış fotoğraf akışı",
                    "Koruma planları",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-border bg-muted px-4 py-3 text-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-28">
              <CardHeader>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Rezervasyon</p>
                <h2 className="font-display text-2xl font-semibold">
                  {new Intl.NumberFormat("tr-TR").format(car.pricePerDay)} ₺ / gün
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-border bg-muted p-4 text-sm">
                  <p className="font-medium">Tek tarih aralığı, bağımsız saatler</p>
                  <p className="mt-1 text-muted-foreground">
                    Alış ve iade saati ayrı düzenlenir, otomatik kilitlenme yok.
                  </p>
                </div>
                <BookingWidget dailyRate={car.pricePerDay} />
                <div className="rounded-2xl border border-border p-4 text-sm text-muted-foreground">
                  Sigorta dahil, 7/24 destek ve güvenli ödeme.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-display text-xl font-semibold">Benzer araçlar</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {cars
                  .filter((entry) => entry.id !== car.id)
                  .slice(0, 2)
                  .map((entry) => (
                    <Link
                      key={entry.id}
                      href={`/cars/${entry.id}`}
                      className="flex items-center gap-3 rounded-2xl border border-border p-3 transition hover:bg-muted"
                    >
                      <img src={entry.image} alt="" className="h-16 w-20 rounded-2xl object-cover" />
                      <div className="flex-1">
                        <p className="font-medium">
                          {entry.brand} {entry.model}
                        </p>
                        <p className="text-sm text-muted-foreground">{entry.city}</p>
                      </div>
                    </Link>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function Feature({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-muted p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}
