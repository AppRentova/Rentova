import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <Card>
      <CardHeader>
        <h1 className="font-display text-3xl font-semibold">Profil</h1>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="rounded-[1.5rem] border border-border bg-muted p-4">
          <div className="flex h-40 items-center justify-center rounded-[1.5rem] border border-dashed border-border bg-background text-sm text-muted-foreground">
            Fotoğraf yükle
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Ad Soyad" />
          <Input placeholder="E-posta" />
          <Input placeholder="Telefon" />
          <Input placeholder="Şehir" />
          <Button className="md:col-span-2 w-full">Profili güncelle</Button>
        </div>
      </CardContent>
    </Card>
  );
}

