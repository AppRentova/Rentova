import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Car, MapPin, Star } from "lucide-react";
import type { Car as CarType } from "@/lib/mock-data";
import Link from "next/link";

function formatPrice(value: number) {
  return new Intl.NumberFormat("tr-TR").format(value);
}

export function CarCard({
  car,
  href,
  selected = false,
  onClick,
}: {
  car: CarType;
  href?: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={car.image} alt={`${car.brand} ${car.model}`} className="h-full w-full object-cover" />
        <div className="absolute left-4 top-4 flex gap-2">
          <Badge className="bg-background/90 text-foreground">{car.transmission}</Badge>
          <Badge className="bg-background/90 text-foreground">{car.fuel}</Badge>
        </div>
      </div>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-xl font-semibold">
              {car.brand} {car.model}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {car.year} · {car.seats} koltuk · {car.host}
            </p>
          </div>
          <div className="rounded-2xl bg-muted px-3 py-2 text-right">
            <p className="text-lg font-semibold">{formatPrice(car.pricePerDay)} ₺</p>
            <p className="text-xs text-muted-foreground">günlük</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {car.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} /> {car.city} · {car.address}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star size={14} className="fill-current text-brand" /> {car.rating}
          </span>
          <span className="inline-flex items-center gap-1">
            <Car size={14} /> {car.distanceKm} km uzakta
          </span>
        </div>
      </CardContent>
    </>
  );

  const className = `overflow-hidden transition ${selected ? "ring-2 ring-brand shadow-glow" : "hover:-translate-y-1 hover:shadow-glow"}`;

  if (href) {
    return (
      <Card className={className}>
        <Link href={href} className="block">
          {content}
        </Link>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <button type="button" onClick={onClick} className="block w-full text-left">
        {content}
      </button>
    </Card>
  );
}
