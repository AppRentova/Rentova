"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SectionTitle } from "@/components/marketing/section-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/search/date-range-picker";
import type { DateRangeValue } from "@/components/search/date-range-picker";
import { MapPanel } from "@/components/search/map-panel";
import { CarCard } from "@/components/search/car-card";
import { cars } from "@/lib/mock-data";

export default function CarRentalPage() {
  const [city, setCity] = useState("İstanbul");
  const [selectedCarId, setSelectedCarId] = useState<string | null>(cars[0]?.id ?? null);
  const [value, setValue] = useState<DateRangeValue>({
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000 * 3),
    pickupTime: "09:00",
    dropoffTime: "18:00",
  });

  const visibleCars = useMemo(() => cars.filter((car) => car.city.includes(city) || city === ""), [city]);
  const selectedCar = visibleCars.find((car) => car.id === selectedCarId) ?? visibleCars[0];

  return (
    <AppShell compact>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionTitle
          eyebrow="Car rental"
          title="Lokala göre araç kiralama"
          description="Ana sayfadaki hızlı akışın tam arama sürümü."
        />

        <Card className="mt-8 p-4">
          <CardContent className="grid gap-4 p-0 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-4">
              <Input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Adres veya şehir" />
              <DateRangePicker value={value} onChange={setValue} />
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {["GPS", "Anında rezervasyon", "Sigorta", "Premium"].map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline">Yakınımdaki araçlar</Button>
                <Button>Ara</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="space-y-4">
            {selectedCar ? <CarCard car={selectedCar} /> : null}
            <div className="grid gap-4">
              {visibleCars.map((car) => (
                <CarCard key={car.id} car={car} selected={selectedCarId === car.id} onClick={() => setSelectedCarId(car.id)} />
              ))}
            </div>
          </div>
          <MapPanel cars={visibleCars} selectedCarId={selectedCarId} onSelectCar={(car) => setSelectedCarId(car.id)} />
        </div>
      </section>
    </AppShell>
  );
}
