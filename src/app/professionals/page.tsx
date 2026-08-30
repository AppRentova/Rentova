import { AppShell } from "@/components/layout/app-shell";
import { SectionTitle } from "@/components/marketing/section-title";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfessionalsPage() {
  return (
    <AppShell compact>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionTitle
          eyebrow="Profesyoneller"
          title="Filo ve profesyonel araç işletmeleri için"
          description="Kurumsal başvuru akışı ve kullanım senaryosu."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card className="p-6">
            <CardContent className="space-y-4 p-0">
              <Input placeholder="Ad Soyad" />
              <Input placeholder="E-posta" />
              <Input placeholder="Telefon" />
              <Input placeholder="Şirket / filo" />
              <Button className="w-full">Başvuru gönder</Button>
            </CardContent>
          </Card>
          <div className="rounded-[2rem] border border-border bg-muted p-6">
            <h2 className="font-display text-3xl font-semibold">Filo yönetimi, fiyatlama ve destek.</h2>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

