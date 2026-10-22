"use client";

import { getLocalTimeZone, today, type DateValue } from "@internationalized/date";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Button,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Calendar as CalendarPrimitive,
  type CalendarProps,
  Heading,
  RangeCalendar as RangeCalendarPrimitive,
  type RangeCalendarProps,
} from "react-aria-components";
import { cn } from "../../lib/utils";

export function RangeCalendar(props: RangeCalendarProps<DateValue>) {
  const currentDay = today(getLocalTimeZone());
  return <RangeCalendarPrimitive {...props} className={cn("rentova-calendar", typeof props.className === "string" && props.className)}>
    <header><Button slot="previous" aria-label="Previous month"><ChevronLeft aria-hidden="true" /></Button><Heading /><Button slot="next" aria-label="Next month"><ChevronRight aria-hidden="true" /></Button></header>
    <CalendarGrid><CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader><CalendarGridBody>{(date) => <CalendarCell date={date} className={cn(date.compare(currentDay) === 0 && "is-today")} />}</CalendarGridBody></CalendarGrid>
  </RangeCalendarPrimitive>;
}

export function Calendar(props: CalendarProps<DateValue>) {
  const currentDay = today(getLocalTimeZone());
  return <CalendarPrimitive {...props} className={cn("rentova-calendar", typeof props.className === "string" && props.className)}>
    <header><Button slot="previous" aria-label="Previous month"><ChevronLeft aria-hidden="true" /></Button><Heading /><Button slot="next" aria-label="Next month"><ChevronRight aria-hidden="true" /></Button></header>
    <CalendarGrid><CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader><CalendarGridBody>{(date) => <CalendarCell date={date} className={cn(date.compare(currentDay) === 0 && "is-today")} />}</CalendarGridBody></CalendarGrid>
  </CalendarPrimitive>;
}
