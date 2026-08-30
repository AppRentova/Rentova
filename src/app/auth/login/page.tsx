import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <AppShell compact>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">Giriş</p>
          <h1 className="font-display text-5xl font-semibold tracking-tight">Let’s hit the road</h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            Üye ol, aracını yönet, seyahatlerini takip et ve mesajlarını tek panelden kontrol et.
          </p>
        </div>
        <Card>
          <CardHeader>
            <h2 className="font-display text-2xl font-semibold">Giriş yap</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="E-posta" type="email" />
            <Input placeholder="Şifre" type="password" />
            <Button className="w-full">Giriş yap</Button>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <Link href="/auth/register" className="text-foreground underline underline-offset-4">
                Hesap oluştur
              </Link>
              <span>·</span>
              <Link href="/help" className="underline underline-offset-4">
                Yardım merkezi
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}

