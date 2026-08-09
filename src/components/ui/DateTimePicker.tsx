"use client";

import { useEffect, useRef, useState } from "react";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { enUS, tr } from "date-fns/locale";

interface DateTimePickerProps {
  locale: string;
  startDate: Date;
  endDate: Date;
  onChange: (start: Date, end: Date) => void;
}

const timesList = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2).toString().padStart(2, "0");
  const minute = index % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});

export function DateTimePicker({ locale, startDate, endDate, onChange }: DateTimePickerProps) {
  const [openPanel, setOpenPanel] = useState<"date" | "start" | "end" | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const currentLocale = locale === "tr" ? tr : enUS;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenPanel(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectDay = (day: Date) => {
    if (isBefore(day, startOfDay(new Date()))) return;
    if (isBefore(day, startDate) || !isSameDay(startDate, endDate)) {
      const nextStart = new Date(day);
      nextStart.setHours(startDate.getHours(), startDate.getMinutes(), 0, 0);
      const nextEnd = addDays(nextStart, 2);
      nextEnd.setHours(endDate.getHours(), endDate.getMinutes(), 0, 0);
      onChange(nextStart, nextEnd);
      return;
    }

    const nextEnd = new Date(day);
    nextEnd.setHours(endDate.getHours(), endDate.getMinutes(), 0, 0);
    onChange(startDate, nextEnd);
    setOpenPanel(null);
  };

  const selectTime = (type: "start" | "end", value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    const nextStart = new Date(startDate);
    const nextEnd = new Date(endDate);

    if (type === "start") {
      nextStart.setHours(hours, minutes, 0, 0);
    } else {
      nextEnd.setHours(hours, minutes, 0, 0);
    }

    onChange(nextStart, nextEnd);
    setOpenPanel(null);
  };

  const renderCalendar = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const days = eachDayOfInterval({ start: monthStart, end: endOfMonth(monthDate) });
    const offset = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;
    const weekDays = locale === "tr" ? ["Pt", "Sa", "Ca", "Pe", "Cu", "Ct", "Pz"] : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    return (
      <div className="min-w-[280px]">
        <h3 className="mb-4 text-center text-base font-black capitalize text-[#111827] dark:text-white">
          {format(monthDate, "MMMM yyyy", { locale: currentLocale })}
        </h3>
        <div className="mb-2 grid grid-cols-7 text-center text-xs font-bold text-gray-400">
          {weekDays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: offset }).map((_, index) => (
            <span key={`empty-${index}`} />
          ))}
          {days.map((day) => {
            const selected = isSameDay(day, startDate) || isSameDay(day, endDate);
            const inRange = isAfter(day, startDate) && isBefore(day, endDate);
            const disabled = isBefore(day, startOfDay(new Date()));

            return (
              <button
                key={day.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => selectDay(day)}
                className={`h-10 text-sm font-bold transition ${
                  selected
                    ? "bg-[var(--primary-purple)] text-white"
                    : inRange
                      ? "bg-[#f1e8ff] text-[var(--primary-purple)] dark:bg-white/10"
                      : disabled
                        ? "text-gray-300 dark:text-gray-700"
                        : "text-[#111827] hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
                }`}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative z-[90] w-full">
      <div className="grid gap-2 md:grid-cols-[1fr_180px_180px]">
        <button
          type="button"
          onClick={() => setOpenPanel(openPanel === "date" ? null : "date")}
          className="grid grid-cols-2 border border-gray-200 bg-white text-left transition hover:border-[var(--primary-purple)] dark:border-white/10 dark:bg-[#101018]"
        >
          <span className="border-r border-gray-200 px-4 py-3 dark:border-white/10">
            <span className="block text-[10px] font-black uppercase text-gray-400">Alis</span>
            <span className="text-sm font-black text-[#111827] dark:text-white">{format(startDate, "dd MMM yyyy")}</span>
          </span>
          <span className="px-4 py-3">
            <span className="block text-[10px] font-black uppercase text-gray-400">Iade</span>
            <span className="text-sm font-black text-[#111827] dark:text-white">{format(endDate, "dd MMM yyyy")}</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOpenPanel(openPanel === "start" ? null : "start")}
          className="border border-gray-200 bg-white px-4 py-3 text-sm font-black text-[#111827] transition hover:border-[var(--primary-purple)] dark:border-white/10 dark:bg-[#101018] dark:text-white"
        >
          {format(startDate, "HH:mm")}
        </button>
        <button
          type="button"
          onClick={() => setOpenPanel(openPanel === "end" ? null : "end")}
          className="border border-gray-200 bg-white px-4 py-3 text-sm font-black text-[#111827] transition hover:border-[var(--primary-purple)] dark:border-white/10 dark:bg-[#101018] dark:text-white"
        >
          {format(endDate, "HH:mm")}
        </button>
      </div>

      {openPanel === "date" && (
        <div className="absolute left-0 top-full z-[120] mt-3 w-[min(720px,calc(100vw-2rem))] border border-gray-200 bg-white p-5 shadow-[0_30px_90px_rgba(17,24,39,0.22)] dark:border-white/10 dark:bg-[#151522]">
          <div className="mb-4 flex items-center justify-between">
            <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} className="border border-gray-200 px-3 py-2 font-black dark:border-white/10">
              ←
            </button>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-300">Tarih araligini sec</p>
            <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="border border-gray-200 px-3 py-2 font-black dark:border-white/10">
              →
            </button>
          </div>
          <div className="flex gap-6 overflow-x-auto">
            {renderCalendar(currentMonth)}
            {renderCalendar(addMonths(currentMonth, 1))}
          </div>
        </div>
      )}

      {(openPanel === "start" || openPanel === "end") && (
        <div className="absolute right-0 top-full z-[120] mt-3 grid max-h-72 w-52 grid-cols-2 gap-1 overflow-y-auto border border-gray-200 bg-white p-2 shadow-[0_30px_90px_rgba(17,24,39,0.22)] dark:border-white/10 dark:bg-[#151522]">
          {timesList.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => selectTime(openPanel, time)}
              className="px-3 py-2 text-sm font-bold text-[#111827] transition hover:bg-[#eef7f5] hover:text-[#0f766e] dark:text-gray-100 dark:hover:bg-white/10"
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
