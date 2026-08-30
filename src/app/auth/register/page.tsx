import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  return (
    <AppShell compact>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 lg:grid-cols-[0.9fr_1fr]">
        <Card>
          <CardHeader>
            <h1 className="font-display text-3xl font-semibold">Hesap oluştur</h1>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Ad Soyad" />
            <Input placeholder="E-posta" type="email" />
            <Input placeholder="Telefon" />
            <Input placeholder="Şifre" type="password" />
            <Button className="w-full">Kayıt ol</Button>
          </CardContent>
        </Card>
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">Üyelik</p>
          <h2 className="font-display text-5xl font-semibold tracking-tight">Profili doğrula, aracı hemen kirala.</h2>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            Kimlik yükleme, profil fotoğrafı, ödeme yöntemi ve sürücü bilgileri tek akışta.
          </p>
          <Link href="/auth/login">
            <Button variant="outline">Zaten hesabım var</Button>
          </Link>
        </div>
      </section>
    </AppShell>
  );
}

