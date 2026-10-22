"use client";

import { Clock3, LocateFixed, MapPin } from "lucide-react";
import { useState } from "react";
import { CalendarDatePicker } from "./ui/calendar-date-picker";

export function SearchPanel() {
  const [location, setLocation] = useState("Kadıköy, Istanbul");
  const [gpsState, setGpsState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const locate = () => {
    if (!navigator.geolocation) { setGpsState("error"); return; }
    setGpsState("loading");
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setLocation(`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
      setGpsState("ready");
    }, () => setGpsState("error"), { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 });
  };
  return <form className="search-panel" action="/search">
    <label className="booking-field location-field"><span><MapPin aria-hidden="true" />Pick-up location</span><div className="location-input-wrap"><input name="location" value={location} onChange={(event) => setLocation(event.target.value)} aria-label="Pick-up location" /><button type="button" onClick={locate} disabled={gpsState === "loading"} aria-label="Use my current location"><LocateFixed aria-hidden="true" /><span>{gpsState === "loading" ? "Locating…" : "Use GPS"}</span></button></div></label>
    {gpsState !== "idle" && <p className={`home-gps-status ${gpsState}`} role="status">{gpsState === "ready" ? "Current location added." : gpsState === "error" ? "Location could not be accessed. Check browser permission." : "Finding your location…"}</p>}
    <div className="field-row"><CalendarDatePicker id="pickup-date" name="pickupDate" label="Pick-up" defaultValue="2026-10-24" /><label className="booking-field"><span><Clock3 aria-hidden="true" />Time</span><input name="pickupTime" type="time" defaultValue="10:00" /></label></div>
    <div className="field-row"><CalendarDatePicker id="return-date" name="returnDate" label="Return" defaultValue="2026-10-26" /><label className="booking-field"><span><Clock3 aria-hidden="true" />Time</span><input name="returnTime" type="time" defaultValue="10:00" /></label></div>
    <button className="button button-lime mobile-search-action" type="submit">Find available cars</button>
  </form>;
}
