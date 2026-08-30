import { AppShell } from "@/components/layout/app-shell";
import { SectionTitle } from "@/components/marketing/section-title";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const coverages = [
  "Temel koruma",
  "Artırılmış koruma",
  "Premium koruma",
  "7/24 yol yardımı",
];

export default function InsurancePage() {
  return (
    <AppShell compact>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionTitle
          eyebrow="Sigorta"
          title="Her yolculuk için kapsamlı koruma"
          description="Kira süresi boyunca sigorta, yol yardımı ve koruma planlarını net şekilde anlatan sayfa."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {coverages.map((item) => (
            <Card key={item} className="p-6">
              <CardContent className="p-0">
                <p className="font-medium">{item}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge>Deductible</Badge>
          <Badge>Liability</Badge>
          <Badge>Roadside assistance</Badge>
        </div>
      </section>
    </AppShell>
  );
}

