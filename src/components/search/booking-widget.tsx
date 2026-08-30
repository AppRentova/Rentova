"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "./date-range-picker";
import type { DateRangeValue } from "./date-range-picker";

export function BookingWidget({ dailyRate }: { dailyRate: number }) {
  const [value, setValue] = useState<DateRangeValue>({
    startDate: new Date(),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    pickupTime: "09:00",
    dropoffTime: "18:00",
  });

  return (
    <div className="space-y-4">
      <DateRangePicker value={value} onChange={setValue} />
      <div className="rounded-2xl border border-border bg-muted p-4 text-sm">
        <p className="font-medium">Tahmini toplam</p>
        <p className="mt-1 text-muted-foreground">
          {dailyRate} ₺ / gün üzerinden yaklaşık fiyat hesaplanır.
        </p>
      </div>
      <Button className="w-full">Rezervasyonu tamamla</Button>
    </div>
  );
}
