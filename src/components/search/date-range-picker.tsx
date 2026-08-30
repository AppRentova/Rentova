"use client";

import { CalendarDays, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Value = {
  startDate: Date | null;
  endDate: Date | null;
  pickupTime: string;
  dropoffTime: string;
};

export type DateRangeValue = Value;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function fromDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return toDateKey(a) === toDateKey(b);
}

function isWithinRange(day: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  const time = day.getTime();
  return time > start.getTime() && time < end.getTime();
}

const TIME_OPTIONS = Array.from({ length: 28 }, (_, index) => {
  const hours = 7 + Math.floor(index / 2);
  const minutes = index % 2 === 0 ? "00" : "30";
  return `${pad(hours)}:${minutes}`;
});

export function DateRangePicker({
  value,
  onChange,
}: {
  value: Value;
  onChange: (value: Value) => void;
}) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => startOfMonth(value.startDate ?? new Date()));

  const displayText = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "short",
      weekday: "short",
    });
    const start = value.startDate ? formatter.format(value.startDate) : "Alış tarihi";
    const end = value.endDate ? formatter.format(value.endDate) : "İade tarihi";
    return `${start} · ${value.pickupTime} → ${end} · ${value.dropoffTime}`;
  }, [value]);

  const months = [cursor, addMonths(cursor, 1)];

  function selectDate(date: Date) {
    if (!value.startDate || (value.startDate && value.endDate)) {
      onChange({ ...value, startDate: date, endDate: null });
      return;
    }
    if (date.getTime() < value.startDate.getTime()) {
      onChange({ ...value, startDate: date, endDate: value.startDate });
      return;
    }
    onChange({ ...value, endDate: date });
  }

  function renderMonth(monthDate: Date) {
    const firstDay = monthDate.getDay();
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    const blanks = Array.from({ length: (firstDay + 6) % 7 });
    const days = Array.from({ length: daysInMonth }, (_, index) => addDays(monthDate, index));

    return (
      <div className="rounded-3xl border border-border bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-medium">
            {monthDate.toLocaleDateString("tr-TR", { month: "long", year: "numeric" })}
          </p>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setCursor(addMonths(cursor, -1))} className="rounded-full p-2 hover:bg-muted">
              <ChevronLeft size={16} />
            </button>
            <button type="button" onClick={() => setCursor(addMonths(cursor, 1))} className="rounded-full p-2 hover:bg-muted">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
            <span key={day} className="py-2">
              {day}
            </span>
          ))}
          {blanks.map((_, index) => (
            <span key={`blank-${index}`} />
          ))}
          {days.map((day) => {
            const selected = isSameDay(day, value.startDate) || isSameDay(day, value.endDate);
            const inside = isWithinRange(day, value.startDate, value.endDate);
            return (
              <button
                key={toDateKey(day)}
                type="button"
                onClick={() => selectDate(day)}
                className={cn(
                  "calendar-day rounded-2xl text-sm transition",
                  selected && "bg-brand text-brand-foreground shadow-glow",
                  inside && "bg-brand/10 text-brand",
                  !selected && !inside && "hover:bg-muted"
                )}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 rounded-full border border-border bg-card px-4 py-3 text-left shadow-sm transition hover:border-brand/40"
      >
        <span>
          <span className="block text-xs uppercase tracking-[0.22em] text-muted-foreground">Tarih aralığı</span>
          <span className="mt-1 block text-sm font-medium">{displayText}</span>
        </span>
        <CalendarDays className="shrink-0 text-brand" size={18} />
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+0.75rem)] z-30 w-full rounded-[1.75rem] border border-border bg-background p-4 shadow-glow">
          <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="grid gap-4 md:grid-cols-2">{months.map((month) => <div key={month.toISOString()}>{renderMonth(month)}</div>)}</div>
            <div className="space-y-4 rounded-3xl border border-border bg-card p-4">
              <div>
                <p className="text-sm font-semibold">Saatler bağımsız seçilir</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Alış ve iade saatleri birbirine kilitlenmez.
                </p>
              </div>
              <label className="block space-y-2">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  <Clock3 size={14} /> Alış saati
                </span>
                <select
                  value={value.pickupTime}
                  onChange={(event) => onChange({ ...value, pickupTime: event.target.value })}
                  className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm"
                >
                  {TIME_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  <Clock3 size={14} /> İade saati
                </span>
                <select
                  value={value.dropoffTime}
                  onChange={(event) => onChange({ ...value, dropoffTime: event.target.value })}
                  className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm"
                >
                  {TIME_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Vazgeç
                </Button>
                <Button onClick={() => setOpen(false)}>Uygula</Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
