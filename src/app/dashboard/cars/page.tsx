import Link from "next/link";
import { cars } from "@/lib/mock-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CarsPage() {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Araçlarım</h1>
          <p className="text-sm text-muted-foreground">Araç kaydı, durum ve performans.</p>
        </div>
        <Link href="/list-your-car">
          <Button>Yeni araç ekle</Button>
        </Link>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {cars.map((car) => (
          <Link
            key={car.id}
            href={`/cars/${car.id}`}
            className="rounded-[1.5rem] border border-border p-4 transition hover:bg-muted"
          >
            <img src={car.image} alt="" className="h-40 w-full rounded-2xl object-cover" />
            <p className="mt-4 font-medium">
              {car.brand} {car.model}
            </p>
            <p className="text-sm text-muted-foreground">{car.city}</p>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

