"use client";

import { parseDate, type DateValue } from "@internationalized/date";
import * as Popover from "@radix-ui/react-popover";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { Calendar } from "./calendar-rac";

const formatDate = (date: DateValue) => date.toDate("Europe/Istanbul").toLocaleDateString("tr-TR");

export function CalendarDatePicker({ id, name, label, defaultValue }: { id: string; name: string; label: string; defaultValue: string }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateValue>(parseDate(defaultValue));
  return <label className="booking-field"><span><CalendarDays aria-hidden="true" />{label}</span><Popover.Root open={open} onOpenChange={setOpen}><Popover.Trigger asChild><button id={id} className="calendar-date-button" type="button" aria-label={`${label}: ${formatDate(date)}`}><span>{formatDate(date)}</span><CalendarDays aria-hidden="true" /></button></Popover.Trigger><Popover.Portal><Popover.Content className="date-popover home-date-popover" align="start" sideOffset={3}><Calendar aria-label={`${label} date`} value={date} onChange={(next) => { setDate(next); setOpen(false); }} /><Popover.Arrow className="date-popover-arrow" /></Popover.Content></Popover.Portal></Popover.Root><input type="hidden" name={name} value={date.toString()} /></label>;
}
