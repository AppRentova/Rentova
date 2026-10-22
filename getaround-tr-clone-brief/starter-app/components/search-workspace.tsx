"use client";

import { ChevronDown, LocateFixed, MapPin, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { Coordinates } from "../lib/geo";
import { distanceInKilometers, formatDistance } from "../lib/geo";
import type { Vehicle } from "../lib/vehicles";
import { SearchExplorer } from "./search-explorer";
import { RentalDatePicker } from "./ui/rental-date-picker";

type LocationState = "idle" | "locating" | "ready" | "denied" | "unsupported" | "error";

export function SearchWorkspace({ vehicles }: { vehicles: Vehicle[] }) {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationState, setLocationState] = useState<LocationState>("idle");
  const nearbyVehicles = useMemo(() => {
    if (!userLocation) return vehicles;
    return vehicles.map((vehicle) => {
      const distanceKm = distanceInKilometers(userLocation, vehicle.location);
      return { ...vehicle, distance: formatDistance(distanceKm), distanceKm };
    }).filter((vehicle) => vehicle.distanceKm <= 35).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [userLocation, vehicles]);

  const locate = () => {
    if (!("geolocation" in navigator)) { setLocationState("unsupported"); return; }
    setLocationState("locating");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setUserLocation({ lat: coords.latitude, lng: coords.longitude }); setLocationState("ready"); },
      (error) => setLocationState(error.code === error.PERMISSION_DENIED ? "denied" : "error"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  };

  const statusText = { idle: "", locating: "Finding your location…", ready: `${nearbyVehicles.length} cars within 35 km`, denied: "Location permission was blocked. Enable it in your browser settings.", unsupported: "This browser does not support location services.", error: "Your location could not be found. Try again." }[locationState];

  return <>
    <form className="search-command-bar" action="/search">
      <label className="search-location"><MapPin aria-hidden="true" /><span>Pick-up location</span><input name="location" defaultValue="Kadıköy, Istanbul" autoComplete="street-address" /></label>
      <button className="gps-search-button" type="button" onClick={locate} disabled={locationState === "locating"}><LocateFixed aria-hidden="true" />{locationState === "locating" ? "Locating…" : "Use my location"}</button>
      <RentalDatePicker />
      <button className="search-submit" type="submit">Update search</button>
    </form>
    {statusText && <div className={`gps-status gps-status-${locationState}`} role={locationState === "ready" ? "status" : "alert"}>{statusText}</div>}
    <div className="search-filter-bar" aria-label="Search filters"><button type="button">Vehicle type <ChevronDown aria-hidden="true" /></button><button type="button">Transmission <ChevronDown aria-hidden="true" /></button><button type="button">Instant booking <ChevronDown aria-hidden="true" /></button><button type="button" className="more-filters"><SlidersHorizontal aria-hidden="true" /> More filters <span>1</span></button></div>
    <SearchExplorer vehicles={nearbyVehicles} userLocation={userLocation} />
  </>;
}
