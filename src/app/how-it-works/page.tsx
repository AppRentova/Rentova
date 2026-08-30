import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { SectionTitle } from "@/components/marketing/section-title";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const steps = [
  ["Önce ara", "Filtrele, karşılaştır, haritada incele."],
  ["Sonra rezerve et", "Tek date range picker ile planı netleştir."],
  ["Sonra yola çık", "Uygulama üzerinden kilidi aç ve sür."],
];

export default function HowItWorksPage() {
  return (
    <AppShell compact>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionTitle eyebrow="Nasıl çalışır" title="Kullanıcı akışı sade, hızlı ve güvenli" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map(([title, text], index) => (
            <Card key={title} className="p-6">
              <CardContent className="p-0">
                <p className="text-xs uppercase tracking-[0.2em] text-brand">0{index + 1}</p>
                <p className="mt-3 font-display text-2xl font-semibold">{title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/search">
            <Button>Araç ara</Button>
          </Link>
          <Link href="/trust">
            <Button variant="outline">Güven sayfası</Button>
          </Link>
        </div>
      </section>
    </AppShell>
  );
}

