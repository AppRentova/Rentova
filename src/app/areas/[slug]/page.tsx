import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { SectionTitle } from "@/components/marketing/section-title";
import { Card, CardContent } from "@/components/ui/card";
import { cars } from "@/lib/mock-data";

const areaNames: Record<string, string> = {
  istanbul: "İstanbul",
  ankara: "Ankara",
  izmir: "İzmir",
  california: "California",
};

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = areaNames[slug];
  if (!name) notFound();

  return (
    <AppShell compact>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionTitle
          eyebrow="Bölge"
          title={`${name} için araç kiralama`}
          description="Bölgeye göre arama ve öne çıkan araçlar."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {cars.map((car) => (
            <Card key={car.id} className="p-4">
              <CardContent className="p-0">
                <p className="font-medium">
                  {car.brand} {car.model}
                </p>
                <p className="text-sm text-muted-foreground">{car.city}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
