import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentMethodsPage() {
  return (
    <Card>
      <CardHeader>
        <h1 className="font-display text-3xl font-semibold">Ödeme yöntemi</h1>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-border p-4">
          <p className="font-medium">Visa ending 4821</p>
          <p className="text-sm text-muted-foreground">Son kullanım: 08/28</p>
        </div>
        <Button>Yeni kart ekle</Button>
      </CardContent>
    </Card>
  );
}

