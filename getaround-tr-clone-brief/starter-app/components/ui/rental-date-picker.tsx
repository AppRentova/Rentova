"use client";

import { parseDate, type DateValue } from "@internationalized/date";
import * as Popover from "@radix-ui/react-popover";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { RangeValue } from "react-aria-components";
import { RangeCalendar } from "./calendar-rac";

const formatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const displayDate = (value: DateValue) => formatter.format(value.toDate("Europe/Istanbul"));

export function RentalDatePicker() {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<RangeValue<DateValue>>({ start: parseDate("2026-10-24"), end: parseDate("2026-10-26") });
  return <Popover.Root open={open} onOpenChange={setOpen}>
    <div className="rental-date-picker">
      <Popover.Trigger asChild><button className="date-trigger" type="button"><CalendarDays aria-hidden="true" /><span><small>Pick-up</small><strong>{displayDate(range.start)} · 10:00</strong></span><ChevronDown aria-hidden="true" /></button></Popover.Trigger>
      <button className="date-trigger" type="button" onClick={() => setOpen(true)}><CalendarDays aria-hidden="true" /><span><small>Return</small><strong>{displayDate(range.end)} · 10:00</strong></span><ChevronDown aria-hidden="true" /></button>
      <input type="hidden" name="pickup" value={`${range.start.toString()}T10:00`} />
      <input type="hidden" name="return" value={`${range.end.toString()}T10:00`} />
    </div>
    <Popover.Portal><Popover.Content className="date-popover" align="center" sideOffset={8}><RangeCalendar aria-label="Rental period" value={range} onChange={(next) => { setRange(next); if (next.start && next.end) setOpen(false); }} minValue={parseDate("2026-10-22")} /><Popover.Arrow className="date-popover-arrow" /></Popover.Content></Popover.Portal>
  </Popover.Root>;
}
