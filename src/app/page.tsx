"use client";

import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck, Star, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { SectionTitle } from "@/components/marketing/section-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/search/date-range-picker";
import type { DateRangeValue } from "@/components/search/date-range-picker";
import { cars } from "@/lib/mock-data";
import { useState } from "react";

const features = [
  {
    icon: Zap,
    title: "Saatlik veya günlük kiralama",
    text: "İhtiyacına göre hızlı rezervasyon, net fiyat ve esnek zaman planı.",
  },
  {
    icon: MapPin,
    title: "Konum bazlı arama",
    text: "GPS ile yakındaki araçları gör, haritada incele ve tek akışta filtrele.",
  },
  {
    icon: ShieldCheck,
    title: "Güvenli rezervasyon",
    text: "Kimlik doğrulama, sigorta ve koruma planları tek çatı altında.",
  },
];

export default function HomePage() {
  return (
    <AppShell>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6">
              <CardContent className="p-0">
                <feature.icon className="text-brand" />
                <h3 className="mt-4 font-display text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionTitle
          eyebrow="Nasıl çalışır"
          title="Araç bul, saat aralığını seç, yola çık."
          description="Getaround benzeri ana akış burada birebir korunuyor: arama, harita, kartlar ve rezervasyon."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {[
            "Yakındaki araçları konuma göre filtrele",
            "Tek date range picker ile alış/iade aralığını seç",
            "Rezervasyonu tamamla ve uygulamadan kilidi aç",
          ].map((item, index) => (
            <Card key={item} className="p-6">
              <CardContent className="p-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
                  {index + 1}
                </div>
                <p className="mt-4 font-medium">{item}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionTitle eyebrow="Öne çıkanlar" title="Türkiye için tasarlanmış güçlü kiralama deneyimi" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="overflow-hidden">
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
              <img
                src={cars[0].image}
                alt="Öne çıkan araç"
                className="h-full w-full object-cover"
              />
              <div className="absolute left-5 top-5 rounded-full bg-background/95 px-4 py-2 text-sm font-medium">
                Popüler seçim
              </div>
            </div>
            <CardContent className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="font-display text-3xl font-semibold">
                  {cars[0].brand} {cars[0].model}
                </p>
                <p className="mt-2 text-muted-foreground">{cars[0].description}</p>
              </div>
              <Link href={`/cars/${cars[0].id}`}>
                <Button>
                  Aracı incele
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="grid gap-4">
                {cars.slice(0, 3).map((car) => (
                  <Link
                    key={car.id}
                    href={`/cars/${car.id}`}
                    className="flex items-center gap-4 rounded-[1.5rem] border border-border p-3 transition hover:bg-muted"
                  >
                    <img src={car.image} alt="" className="h-20 w-24 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <p className="font-medium">{car.brand} {car.model}</p>
                      <p className="text-sm text-muted-foreground">{car.city} · {car.pricePerDay} ₺ / gün</p>
                    </div>
                    <Badge>{car.rating} ★</Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <LandingSearch />
      </section>
    </AppShell>
  );
}

function Hero() {
  const [search, setSearch] = useState<DateRangeValue>({
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000 * 2),
    pickupTime: "09:00",
    dropoffTime: "18:00",
  });

  return (
    <section className="mx-auto max-w-7xl px-4 pt-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <Badge className="w-fit border-0 bg-brand/10 text-brand">Getaround hissiyle birebir ürün akışı</Badge>
          <h1 className="font-display text-5xl font-semibold tracking-tight md:text-7xl">
            Türkiye’de araç kiralama, hızlı ve temiz.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            Konuma göre araç bul, tek bir tarih aralığı seç, alış ve iade saatlerini ayrı kontrol et, haritada gör ve rezervasyonu tamamla.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/search">
              <Button size="lg">Araç ara</Button>
            </Link>
            <Link href="/list-your-car">
              <Button variant="outline" size="lg">
                Aracını listele
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Star size={16} className="fill-current text-brand" /> 4.6/5 kullanıcı puanı</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck size={16} /> Sigorta dahil</span>
            <span className="inline-flex items-center gap-2"><Zap size={16} /> 7/24 erişim</span>
          </div>
        </div>
        <Card className="p-4 shadow-glow">
          <CardContent className="space-y-4 p-0">
            <div className="rounded-[1.75rem] border border-border bg-muted/40 p-4">
              <p className="mb-3 text-sm font-medium">Hızlı arama</p>
              <div className="space-y-3">
                <div className="rounded-3xl border border-border bg-background p-3 text-sm text-muted-foreground">İstanbul, Beşiktaş</div>
                <DateRangePicker value={search} onChange={setSearch} />
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-border bg-brand p-5 text-brand-foreground">
              <p className="text-sm uppercase tracking-[0.2em] opacity-80">Anında erişim</p>
              <p className="mt-2 font-display text-2xl font-semibold">Harita, araç listesi ve rezervasyon tek ekranda.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function LandingSearch() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <SectionTitle
            eyebrow="Ara"
            title="Yakındaki araçlar ve canlı harita"
            description="Harita paneli dark mode’da da kararmıyor. Liste tek sırada, temiz ve kaydırması rahat."
          />
          <div className="rounded-[1.5rem] border border-border bg-muted p-4">
            <p className="text-sm font-medium">Popüler filtreler</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Otomatik", "Elektrik", "Hibrit", "Aile", "Premium", "Anında rezervasyon"].map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-border bg-card p-4">
          <div className="map-surface min-h-[340px] rounded-[1.5rem] border border-border p-4">
            <div className="grid-overlay h-full rounded-[1.25rem] p-4">
              <div className="space-y-3">
                {cars.slice(0, 3).map((car, index) => (
                  <div
                    key={car.id}
                    className="inline-flex rounded-full border border-border bg-background/95 px-4 py-2 text-sm shadow-sm"
                    style={{ marginLeft: `${index * 18}%`, marginTop: `${index * 34}px` }}
                  >
                    {car.brand} {car.model}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
