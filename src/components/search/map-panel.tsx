import { CarFront, MapPinned } from "lucide-react";
import type { Car } from "@/lib/mock-data";

export function MapPanel({
  cars,
  selectedCarId,
  onSelectCar,
}: {
  cars: Car[];
  selectedCarId?: string | null;
  onSelectCar?: (car: Car) => void;
}) {
  return (
    <div className="map-surface overflow-hidden rounded-[2rem] border border-border shadow-sm">
      <div className="grid-overlay relative min-h-[520px] p-5">
        <div className="absolute left-5 top-5 rounded-full border border-border bg-background/95 px-4 py-2 text-sm font-medium shadow-sm">
          <span className="inline-flex items-center gap-2">
            <MapPinned size={16} className="text-brand" /> Yakındaki araçlar
          </span>
        </div>
        {cars.map((car, index) => (
          <button
            key={car.id}
            type="button"
            onClick={() => onSelectCar?.(car)}
            className={`absolute flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium shadow-sm transition ${
              selectedCarId === car.id
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border bg-background/95 hover:-translate-y-0.5"
            }`}
            style={{
              left: `${12 + index * 18}%`,
              top: `${18 + index * 12}%`,
            }}
          >
            <CarFront size={14} className="text-brand" />
            {car.brand} {car.model}
          </button>
        ))}
        <div className="absolute inset-x-7 bottom-7 rounded-[1.5rem] border border-border bg-background/95 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Harita görünümü</p>
              <p className="text-sm text-muted-foreground">
                Gerçek harita entegrasyonu için Mapbox anahtarı hazır.
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">{cars.length} araç</p>
              <p className="text-muted-foreground">bu bölgede</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
