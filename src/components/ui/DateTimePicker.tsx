"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { enUS, tr } from "date-fns/locale";

interface DateTimePickerProps {
  locale: string;
  startDate: Date;
  endDate: Date;
  onChange: (start: Date, end: Date) => void;
}

type Panel = "date" | "time" | null;

const TIME_SLOTS = Array.from({ length: 48 }, (_, index) => {
  const hour = String(Math.floor(index / 2)).padStart(2, "0");
  const minute = index % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});

const WEEK_LABELS = {
  en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  tr: ["Pt", "Sa", "Ca", "Pe", "Cu", "Ct", "Pz"],
} as const;

function cloneDate(date: Date) {
  return new Date(date.getTime());
}

function normalizeDay(date: Date) {
  const next = cloneDate(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function mergeDayAndTime(day: Date, timeSource: Date) {
  const next = cloneDate(day);
  next.setHours(timeSource.getHours(), timeSource.getMinutes(), 0, 0);
  return next;
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M14.5 5.5L8 12l6.5 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M9.5 5.5L16 12l-6.5 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatRangeLabel(locale: string, startDate: Date, endDate: Date) {
  const localeData = locale === "tr" ? tr : enUS;
  const pattern = locale === "tr" ? "d MMM yyyy" : "MMM d, yyyy";
  return `${format(startDate, pattern, { locale: localeData })} - ${format(endDate, pattern, { locale: localeData })}`;
}

function formatTimeRange(startDate: Date, endDate: Date) {
  return `${format(startDate, "HH:mm")} - ${format(endDate, "HH:mm")}`;
}

function DayCell({
  day,
  monthDate,
  startDate,
  endDate,
  locale,
  onSelect,
}: {
  day: Date;
  monthDate: Date;
  startDate: Date;
  endDate: Date;
  locale: string;
  onSelect: (day: Date) => void;
}) {
  const localeData = locale === "tr" ? tr : enUS;
  const today = normalizeDay(new Date());
  const dayOnly = normalizeDay(day);
  const start = normalizeDay(startDate);
  const end = normalizeDay(endDate);
  const isStart = isSameDay(dayOnly, start);
  const isEnd = isSameDay(dayOnly, end);
  const inRange = isAfter(dayOnly, start) && isBefore(dayOnly, end);
  const isToday = isSameDay(dayOnly, today);
  const disabled = isBefore(dayOnly, today);
  const outsideMonth = !isSameMonth(dayOnly, monthDate);
  const sameDayRange = isSameDay(start, end);

  const classes = [
    "relative flex h-10 items-center justify-center text-sm font-semibold transition",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-purple)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#12121a]",
    disabled
      ? "cursor-not-allowed text-slate-300 dark:text-slate-700"
      : outsideMonth
        ? "text-slate-400/80 hover:bg-slate-100 dark:text-slate-600 dark:hover:bg-white/5"
        : "text-slate-900 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/5",
  ];

  if (isStart && isEnd) {
    classes.push("rounded-full bg-[var(--primary-purple)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]");
  } else if (isStart) {
    classes.push("rounded-l-full bg-[var(--primary-purple)] text-white");
  } else if (isEnd) {
    classes.push("rounded-r-full bg-[var(--primary-purple)] text-white");
  } else if (inRange) {
    classes.push("bg-[color-mix(in_srgb,var(--primary-purple)_12%,white)] text-[var(--primary-purple)] dark:bg-[color-mix(in_srgb,var(--primary-purple)_14%,#12121a)]");
  } else if (isToday) {
    classes.push("ring-1 ring-inset ring-[var(--primary-purple)]");
  }

  if (inRange && isStart && !sameDayRange) classes.push("rounded-l-full");
  if (inRange && isEnd && !sameDayRange) classes.push("rounded-r-full");

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(day)}
      aria-label={format(dayOnly, "PPP", { locale: localeData })}
      aria-selected={isStart || isEnd}
      className={classes.join(" ")}
    >
      {format(day, "d")}
      {isToday && !isStart && !isEnd && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--primary-purple)]" aria-hidden="true" />}
    </button>
  );
}

export function DateTimePicker({ locale, startDate, endDate, onChange }: DateTimePickerProps) {
  const [openPanel, setOpenPanel] = useState<Panel>(null);
  const [rangeStage, setRangeStage] = useState<"start" | "end">("start");
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(startDate));
  const rootRef = useRef<HTMLDivElement>(null);
  const localeData = locale === "tr" ? tr : enUS;
  const weekStartsOn = locale === "tr" ? 1 : 0;
  const weekLabels = locale === "tr" ? WEEK_LABELS.tr : WEEK_LABELS.en;

  const selectedRangeLabel = useMemo(() => formatRangeLabel(locale, startDate, endDate), [endDate, locale, startDate]);
  const selectedTimeLabel = useMemo(() => formatTimeRange(startDate, endDate), [endDate, startDate]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpenPanel(null);
        setRangeStage("start");
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (openPanel === "date") {
      setCurrentMonth(startOfMonth(startDate));
    }
  }, [openPanel, startDate]);

  const monthOptions = useMemo(() => [currentMonth, addMonths(currentMonth, 1)], [currentMonth]);

  const selectDate = (day: Date) => {
    const today = startOfDay(new Date());
    const dayOnly = normalizeDay(day);

    if (isBefore(dayOnly, today)) return;

    if (rangeStage === "start" || isBefore(dayOnly, normalizeDay(startDate))) {
      const nextStart = mergeDayAndTime(dayOnly, startDate);
      const nextEnd = mergeDayAndTime(dayOnly, startDate);
      onChange(nextStart, nextEnd);
      setRangeStage("end");
      return;
    }

    const nextEnd = mergeDayAndTime(dayOnly, startDate);
    onChange(startDate, nextEnd);
    setRangeStage("start");
    setOpenPanel(null);
  };

  const selectTime = (type: "start" | "end", value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    const nextStart = cloneDate(startDate);
    const nextEnd = cloneDate(endDate);

    if (type === "start") {
      nextStart.setHours(hours, minutes, 0, 0);
      nextEnd.setHours(hours, minutes, 0, 0);
    } else {
      nextEnd.setHours(hours, minutes, 0, 0);
      if (nextEnd <= nextStart) {
        nextStart.setHours(hours, minutes, 0, 0);
      }
    }

    onChange(nextStart, nextEnd);
    setOpenPanel(null);
  };

  const renderMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const gridStart = startOfWeek(monthStart, { weekStartsOn });
    const gridEnd = endOfWeek(endOfMonth(monthDate), { weekStartsOn });
    const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-[#171724]">
        <h3 className="mb-4 text-center text-base font-semibold text-slate-900 dark:text-white">
          {format(monthDate, "LLLL yyyy", { locale: localeData })}
        </h3>
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          {weekLabels.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <DayCell key={day.toISOString()} day={day} monthDate={monthDate} startDate={startDate} endDate={endDate} locale={locale} onSelect={selectDate} />
          ))}
        </div>
      </div>
    );
  };

  const timePanelTitle = locale === "tr" ? "Saat araligi" : "Time range";

  return (
    <div ref={rootRef} className="relative z-[120] w-full">
      <div className="grid gap-2 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <button
          type="button"
          onClick={() => {
            setOpenPanel((previous) => (previous === "date" ? null : "date"));
            setRangeStage("start");
          }}
          className="flex min-h-16 flex-col justify-center border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-[var(--primary-purple)] dark:border-white/10 dark:bg-[#13131c]"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">{locale === "tr" ? "Tarih araligi" : "Date range"}</span>
          <span className="mt-1 block text-sm font-semibold text-slate-900 dark:text-white">{selectedRangeLabel}</span>
        </button>

        <button
          type="button"
          onClick={() => setOpenPanel((previous) => (previous === "time" ? null : "time"))}
          className="flex min-h-16 flex-col justify-center border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-[var(--primary-purple)] dark:border-white/10 dark:bg-[#13131c]"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">{timePanelTitle}</span>
          <span className="mt-1 block text-sm font-semibold text-slate-900 dark:text-white">{selectedTimeLabel}</span>
        </button>
      </div>

      {openPanel === "date" && (
        <div className="absolute left-0 top-full mt-3 w-[min(780px,calc(100vw-2rem))] rounded-[1.5rem] border border-slate-200 bg-[#f8fafc] p-4 shadow-[0_30px_90px_-30px_rgba(15,23,42,0.5)] dark:border-white/10 dark:bg-[#12121a]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-white/10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                {locale === "tr" ? "Secili aralik" : "Selected range"}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selectedRangeLabel}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 dark:border-white/10 dark:bg-[#171724]">
              <button
                type="button"
                onClick={() => setCurrentMonth((current) => addMonths(current, -1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                aria-label={locale === "tr" ? "Onceki ay" : "Previous month"}
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => setCurrentMonth(startOfMonth(startDate))}
                className="min-w-28 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                {format(currentMonth, "LLLL", { locale: localeData })}
              </button>
              <button
                type="button"
                onClick={() => setCurrentMonth((current) => addMonths(current, 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                aria-label={locale === "tr" ? "Sonraki ay" : "Next month"}
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {monthOptions.map((month) => renderMonth(month))}
          </div>
        </div>
      )}

      {openPanel === "time" && (
        <div className="absolute left-0 top-full mt-3 w-[min(640px,calc(100vw-2rem))] rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_30px_90px_-30px_rgba(15,23,42,0.5)] dark:border-white/10 dark:bg-[#171724]">
          <div className="mb-4 border-b border-slate-200 pb-3 dark:border-white/10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">{timePanelTitle}</p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selectedRangeLabel}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <TimeColumn
              title={locale === "tr" ? "Alis saati" : "Pickup time"}
              value={format(startDate, "HH:mm")}
              locale={locale}
              onSelect={(time) => selectTime("start", time)}
            />
            <TimeColumn
              title={locale === "tr" ? "Iade saati" : "Return time"}
              value={format(endDate, "HH:mm")}
              locale={locale}
              onSelect={(time) => selectTime("end", time)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function TimeColumn({
  title,
  value,
  locale,
  onSelect,
}: {
  title: string;
  value: string;
  locale: string;
  onSelect: (time: string) => void;
}) {
  const localeData = locale === "tr" ? tr : enUS;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#12121a]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">{title}</p>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
            {locale === "tr" ? "Seçili" : "Selected"}: {value}
          </p>
        </div>
      </div>

      <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1">
        {TIME_SLOTS.map((time) => {
          const active = value === time;
          return (
            <button
              key={time}
              type="button"
              onClick={() => onSelect(time)}
              className={[
                "rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                active
                  ? "border-[var(--primary-purple)] bg-[var(--primary-purple)] text-white"
                  : "border-slate-200 bg-white text-slate-900 hover:border-[var(--primary-purple)] hover:bg-white dark:border-white/10 dark:bg-[#171724] dark:text-slate-100 dark:hover:bg-white/5",
              ].join(" ")}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
}
