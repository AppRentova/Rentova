import { AppShell } from "@/components/layout/app-shell";
import { SectionTitle } from "@/components/marketing/section-title";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <AppShell compact>
      <section className="mx-auto max-w-4xl px-4 py-8">
        <SectionTitle eyebrow="İletişim" title="Destek için giriş yapın" description="Kullanıcıya özel iletişim sayfası." />
        <Card className="mt-8 p-6">
          <CardContent className="p-0">
            <p className="text-sm text-muted-foreground">
              Canlı destek, rezervasyon içi mesajlar ve hesap sorunları için giriş yaptıktan sonra iletişime geçebilirsiniz.
            </p>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}

