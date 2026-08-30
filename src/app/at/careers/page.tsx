import { AppShell } from "@/components/layout/app-shell";
import { SectionTitle } from "@/components/marketing/section-title";
import { Card, CardContent } from "@/components/ui/card";

export default function CareersPage() {
  return (
    <AppShell compact>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionTitle eyebrow="Kariyer" title="Ekip ve açık pozisyonlar" />
        <Card className="mt-8 p-6">
          <CardContent className="p-0">
            <p className="text-sm text-muted-foreground">
              Tasarım ve ürün ekipleri için kariyer vitrini.
            </p>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}

