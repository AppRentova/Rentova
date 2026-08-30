import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { SectionTitle } from "@/components/marketing/section-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ListYourCarPage() {
  return (
    <AppShell compact>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionTitle
          eyebrow="Aracını listele"
          title="Arabanı kazanca çevir"
          description="Getaround’daki owner akışına benzer, ama Türkiye’ye uyarlanmış temiz listeleme deneyimi."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <Card className="p-6">
            <CardContent className="space-y-4 p-0">
              <div className="grid gap-3 md:grid-cols-2">
                {["Araç bilgileri", "Fotoğraflar", "Konum", "Fiyatlandırma", "Takvim", "Onay"].map((step, index) => (
                  <div key={step} className="rounded-2xl border border-border bg-muted p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Adım {index + 1}</p>
                    <p className="mt-2 font-medium">{step}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full">Araç kaydı başlat</Button>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-border bg-brand p-6 text-brand-foreground">
              <p className="text-sm uppercase tracking-[0.24em] opacity-80">Kazanç</p>
              <h2 className="mt-3 font-display text-3xl font-semibold">Haftalık, aylık, pro kullanım.</h2>
              <p className="mt-2 text-sm opacity-90">
                Saatlik ve günlük fiyatlar, GPS konum ve rezervasyon kuralları tek panelde.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Sahip koruması", "Sigorta", "7/24 destek", "Anlık rezervasyon"].map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
            <Link href="/rent-your-car">
              <Button variant="outline">Owner akışını incele</Button>
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

