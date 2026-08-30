"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SectionTitle } from "@/components/marketing/section-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DateRangePicker } from "@/components/search/date-range-picker";
import type { DateRangeValue } from "@/components/search/date-range-picker";
import { CarCard } from "@/components/search/car-card";
import { MapPanel } from "@/components/search/map-panel";
import { cars } from "@/lib/mock-data";

export default function SearchPage() {
  const [city, setCity] = useState("İstanbul");
  const [filters, setFilters] = useState<DateRangeValue & { fuel: string; transmission: string }>({
    fuel: "Tümü",
    transmission: "Tümü",
    startDate: new Date(),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    pickupTime: "09:00",
    dropoffTime: "18:00",
  });

  const visibleCars = useMemo(
    () =>
      cars.filter((car) => {
        if (city && car.city !== city) return false;
        if (filters.fuel !== "Tümü" && car.fuel !== filters.fuel) return false;
        if (filters.transmission !== "Tümü" && car.transmission !== filters.transmission) return false;
        return true;
      }),
    [city, filters.fuel, filters.transmission]
  );

  return (
    <AppShell compact>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionTitle
          eyebrow="Ara"
          title="Konuma göre araç bul"
          description="Tek date range picker, bağımsız saat seçimleri ve temiz tek sıra araç listesi."
        />

        <Card className="mt-8 p-4">
          <CardContent className="grid gap-4 p-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <Input value={city} onChange={(event) => setCity(event.target.value)} placeholder="İl veya semt" />
              <DateRangePicker
                value={filters}
                onChange={(value) => setFilters((current) => ({ ...current, ...value }))}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                value={filters.fuel}
                onChange={(event) => setFilters((current) => ({ ...current, fuel: event.target.value }))}
              >
                {["Tümü", "Elektrik", "Hibrit", "Benzin", "Dizel"].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </Select>
              <Select
                value={filters.transmission}
                onChange={(event) => setFilters((current) => ({ ...current, transmission: event.target.value }))}
              >
                {["Tümü", "Otomatik", "Manuel"].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </Select>
              <Button variant="outline">GPS ile konumu bul</Button>
              <Button>Ara</Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>{visibleCars.length} araç</Badge>
              <Badge>Yakın çevre</Badge>
              <Badge>Harita + Liste</Badge>
            </div>
            <div className="grid gap-4">
              {visibleCars.map((car) => (
                <CarCard key={car.id} car={car} href={`/cars/${car.id}`} />
              ))}
            </div>
          </div>
          <MapPanel cars={visibleCars} />
        </div>
      </section>
    </AppShell>
  );
}
