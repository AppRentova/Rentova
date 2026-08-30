import { AppShell } from "@/components/layout/app-shell";
import { SectionTitle } from "@/components/marketing/section-title";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  "Kimlik ve ehliyet doğrulama",
  "Risk skorlama ve dolandırıcılık kontrolü",
  "Düzenlenmiş araç moderasyonu",
  "Doğrulanmış profil ve yorumlar",
];

export default function TrustPage() {
  return (
    <AppShell compact>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionTitle
          eyebrow="Güven"
          title="Güvenli rezervasyon ve doğrulama sistemi"
          description="Getaround trust sayfasındaki ana fikirleri araca uyarlanmış şekilde yeniden kuruyoruz."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item} className="p-6">
              <CardContent className="p-0">
                <p className="font-medium">{item}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

