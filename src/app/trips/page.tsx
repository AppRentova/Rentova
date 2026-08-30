import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { trips } from "@/lib/mock-data";

export default function TripsPage() {
  return (
    <AppShell compact>
      <section className="mx-auto max-w-5xl px-4 py-8">
        <Card>
          <CardHeader>
            <h1 className="font-display text-3xl font-semibold">Seyahatlerim</h1>
          </CardHeader>
          <CardContent className="space-y-3">
            {trips.map((trip) => (
              <div key={trip.title} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{trip.title}</p>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs">{trip.status}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{trip.dates}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}

