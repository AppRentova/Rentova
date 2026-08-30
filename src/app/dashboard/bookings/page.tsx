import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { trips } from "@/lib/mock-data";

export default function BookingsPage() {
  return (
    <Card>
      <CardHeader>
        <h1 className="font-display text-3xl font-semibold">Rezervasyonlar</h1>
      </CardHeader>
      <CardContent className="space-y-3">
        {trips.map((trip) => (
          <div key={trip.title} className="rounded-2xl border border-border p-4">
            <p className="font-medium">{trip.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{trip.dates}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
