"use client";

import { useState, useRef, useEffect } from "react";
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, isAfter, addDays } from "date-fns";
import { tr, enUS } from "date-fns/locale";

interface DateTimePickerProps {
  locale: string;
  startDate: Date;
  endDate: Date;
  onChange: (start: Date, end: Date) => void;
  isOpen?: boolean;
}

export function DateTimePicker({ locale, startDate, endDate, onChange }: DateTimePickerProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState<"start" | "end" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentLocale = locale === "tr" ? tr : enUS;

  // Generate times from 00:00 to 23:30 in 30-min intervals
  const generateTimes = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      const hourStr = h.toString().padStart(2, "0");
      times.push(`${hourStr}:00`);
      times.push(`${hourStr}:30`);
    }
    return times;
  };
  const timesList = generateTimes();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
        setShowTimePicker(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const nextMonth = addMonths(currentMonth, 1);

  const renderCalendar = (monthDate: Date) => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start, end });
    
    // Add empty slots for offset
    const dayOfWeek = start.getDay(); // 0 is Sunday, 1 is Monday...
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Align to Monday start
    const emptyDays = Array(offset).fill(null);

    const weekDays = locale === "tr" ? ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"] : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    return (
      <div className="w-[300px] flex-shrink-0">
        <h3 className="text-center font-bold text-gray-800 mb-4 capitalize">
          {format(monthDate, "MMMM yyyy", { locale: currentLocale })}
        </h3>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-400 mb-2">
          {weekDays.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((day) => {
            const isSelected = isSameDay(day, startDate) || isSameDay(day, endDate);
            const isInRange = isAfter(day, startDate) && isBefore(day, endDate);
            const isPast = isBefore(day, startOfMonth(new Date())) || (isBefore(day, new Date()) && !isSameDay(day, new Date()));
            
            return (
              <button
                key={day.toString()}
                onClick={() => {
                  if (isPast) return;
                  if (isSameDay(day, startDate)) return;
                  
                  if (!startDate || (startDate && endDate)) {
                    onChange(day, addDays(day, 1));
                  } else if (isBefore(day, startDate)) {
                    onChange(day, addDays(day, 1));
                  } else {
                    onChange(startDate, day);
                  }
                }}
                disabled={isPast}
                className={`h-9 w-9 text-xs rounded-sm flex items-center justify-center transition-all ${
                  isSelected 
                    ? "bg-[var(--primary-purple)] text-white font-bold"
                    : isInRange
                    ? "bg-purple-100 text-[var(--primary-purple)] font-semibold"
                    : isPast
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
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

  const handleTimeSelect = (type: "start" | "end", timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    if (type === "start") {
      const newStart = new Date(startDate);
      newStart.setHours(hours, minutes, 0, 0);
      onChange(newStart, endDate);
    } else {
      const newEnd = new Date(endDate);
      newEnd.setHours(hours, minutes, 0, 0);
      onChange(startDate, newEnd);
    }
    setShowTimePicker(null);
  };

  return (
    <div ref={containerRef} className="relative w-full flex flex-col md:flex-row gap-3">
      {/* Date Pickers fields */}
      <div className="flex-1 grid grid-cols-2 gap-2 border border-gray-300 rounded-sm px-4 py-1.5 bg-gray-50 focus-within:ring-2 focus-within:ring-[var(--primary-purple)] focus-within:border-transparent">
        {/* Pickup Field */}
        <div 
          onClick={() => { setShowDatePicker(true); setShowTimePicker(null); }}
          className="cursor-pointer py-1 border-r border-gray-200"
        >
          <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            {locale === "tr" ? "ALIŞ" : "PICKUP"}
          </span>
          <span className="text-sm font-semibold text-gray-800">
            {format(startDate, "dd MMM yyyy")}
          </span>
        </div>
        
        {/* Return Field */}
        <div 
          onClick={() => { setShowDatePicker(true); setShowTimePicker(null); }}
          className="cursor-pointer py-1 pl-3"
        >
          <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            {locale === "tr" ? "İADE" : "RETURN"}
          </span>
          <span className="text-sm font-semibold text-gray-800">
            {format(endDate, "dd MMM yyyy")}
          </span>
        </div>
      </div>

      {/* Time Picker Fields */}
      <div className="w-full md:w-auto grid grid-cols-2 gap-2">
        <div 
          onClick={() => setShowTimePicker("start")}
          className="cursor-pointer border border-gray-300 rounded-sm px-5 py-2.5 bg-gray-50 text-sm font-semibold text-gray-800 text-center hover:bg-gray-100 min-w-[90px]"
        >
          {format(startDate, "HH:mm")}
        </div>
        <div 
          onClick={() => setShowTimePicker("end")}
          className="cursor-pointer border border-gray-300 rounded-sm px-5 py-2.5 bg-gray-50 text-sm font-semibold text-gray-800 text-center hover:bg-gray-100 min-w-[90px]"
        >
          {format(endDate, "HH:mm")}
        </div>
      </div>

      {/* Date Dropdown Modal */}
      {showDatePicker && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-sm shadow-xl border border-gray-100 p-6 z-50 flex gap-6 overflow-x-auto max-w-[95vw] md:max-w-none">
          {renderCalendar(currentMonth)}
          {renderCalendar(nextMonth)}
          
          <button 
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="absolute right-4 top-4 p-1.5 rounded-sm hover:bg-gray-100 text-gray-600"
          >
            →
          </button>
          <button 
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
            className="absolute left-4 top-4 p-1.5 rounded-sm hover:bg-gray-100 text-gray-600"
          >
            ←
          </button>
        </div>
      )}

      {/* Time Picker Dropdown Modal */}
      {showTimePicker && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-sm shadow-xl border border-gray-100 py-2 w-48 max-h-60 overflow-y-auto z-50">
          {timesList.map((timeStr) => (
            <button
              key={timeStr}
              type="button"
              onClick={() => handleTimeSelect(showTimePicker, timeStr)}
              className="w-full px-4 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-[var(--primary-purple)]"
            >
              {timeStr}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
