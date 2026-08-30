import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { SectionTitle } from "@/components/marketing/section-title";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const topics = [
  "Başlangıç",
  "Rezervasyon detayları",
  "Ödemeler",
  "Sigorta ve yol yardımı",
  "Çeşitli",
];

export default function HelpPage() {
  return (
    <AppShell compact>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionTitle eyebrow="Yardım" title="Nasıl yardımcı olabiliriz?" />
        <Card className="mt-8 p-6">
          <CardContent className="space-y-4 p-0">
            <Input placeholder="Soru sor veya anahtar kelimeyle ara" />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {topics.map((topic) => (
                <div key={topic} className="rounded-2xl border border-border bg-muted p-4 text-sm font-medium">
                  {topic}
                </div>
              ))}
            </div>
            <Button className="w-full">Yardım merkezine git</Button>
          </CardContent>
        </Card>
        <div className="mt-6">
          <Link href="/contact" className="text-sm underline underline-offset-4">
            Bize ulaşın
          </Link>
        </div>
      </section>
    </AppShell>
  );
}

