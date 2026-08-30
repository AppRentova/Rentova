import { AppShell } from "@/components/layout/app-shell";
import { SectionTitle } from "@/components/marketing/section-title";
import { Card, CardContent } from "@/components/ui/card";

export default function PressPage() {
  return (
    <AppShell compact>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionTitle eyebrow="Basın" title="Basın odası ve marka bilgileri" />
        <Card className="mt-8 p-6">
          <CardContent className="p-0">
            <p className="text-sm text-muted-foreground">
              Basın kiti, marka hikayesi ve iletişim bilgileri için ayrılmış alan.
            </p>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}

