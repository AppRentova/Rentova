import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { trips, notifications, messages } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Rezervasyonlar, mesajlar ve son durumlar.</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            ["Aktif rezervasyon", "2"],
            ["Bekleyen mesaj", String(messages.length)],
            ["Bildirim", String(notifications.length)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-border bg-muted p-4">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="font-display text-2xl font-semibold">Son seyahatler</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {trips.map((trip) => (
            <div key={trip.title} className="rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{trip.title}</p>
                <span className="text-sm text-muted-foreground">{trip.status}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{trip.dates}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

