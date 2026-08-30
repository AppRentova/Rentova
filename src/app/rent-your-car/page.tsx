import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { SectionTitle } from "@/components/marketing/section-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RentYourCarPage() {
  return (
    <AppShell compact>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionTitle
          eyebrow="Owner"
          title="Aracını yakınındaki insanlara kirala"
          description="Siteye benzer şekilde gelir tahmini, onay akışı, sigorta ve güvenlik bloklarını bir araya getiriyor."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <Card className="p-6">
            <CardContent className="space-y-4 p-0">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["Gelir tahmini", "Aylık kazanç simülasyonu"],
                  ["Rezervasyon", "Anında veya onaylı"],
                  ["Teslimat", "Harita ve konum paylaşımı"],
                  ["Ödeme", "Otomatik tahsilat"],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl border border-border bg-muted p-4">
                    <p className="font-medium">{title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full">Aracını listele</Button>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <Card className="p-6">
              <CardContent className="p-0">
                <h2 className="font-display text-2xl font-semibold">Nasıl çalışır</h2>
                <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li>1. Aracını ekle ve konumunu ayarla</li>
                  <li>2. Rezervasyonları yönet ve takvimini aç/kapat</li>
                  <li>3. Kiralamalardan ödeme al</li>
                </ol>
              </CardContent>
            </Card>
            <div className="flex flex-wrap gap-2">
              {["Connect benzeri deneyim", "Sigorta dahil", "Destek hattı", "Pro fleet"].map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
            <Link href="/professionals">
              <Button variant="outline">Profesyonel paketler</Button>
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

