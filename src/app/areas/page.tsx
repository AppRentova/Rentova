import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { SectionTitle } from "@/components/marketing/section-title";
import { Card, CardContent } from "@/components/ui/card";

const areas = ["istanbul", "ankara", "izmir", "california"];

export default function AreasPage() {
  return (
    <AppShell compact>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionTitle eyebrow="Bölgeler" title="Araç kiralama bölgeleri" />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {areas.map((area) => (
            <Link key={area} href={`/areas/${area}`}>
              <Card className="p-6 transition hover:-translate-y-1">
                <CardContent className="p-0">
                  <p className="font-medium capitalize">{area}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

