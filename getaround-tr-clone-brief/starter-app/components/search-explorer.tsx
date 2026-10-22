"use client";

import { List, Map } from "lucide-react";
import { useEffect, useState } from "react";
import type { Coordinates } from "../lib/geo";
import type { Vehicle } from "../lib/vehicles";
import { SearchResultCard } from "./search-result-card";
import { VehicleMapShell } from "./vehicle-map-shell";

export function SearchExplorer({ vehicles, userLocation }: { vehicles: Vehicle[]; userLocation: Coordinates | null }) {
  const [activeId, setActiveId] = useState(vehicles[0]?.id ?? null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  useEffect(() => {
    if (!vehicles.some((vehicle) => vehicle.id === activeId)) setActiveId(vehicles[0]?.id ?? null);
  }, [activeId, vehicles]);

  return <>
    <div className="search-view-switch" aria-label="Search view">
      <button type="button" className={mobileView === "list" ? "is-active" : ""} onClick={() => setMobileView("list")}><List aria-hidden="true" /> List</button>
      <button type="button" className={mobileView === "map" ? "is-active" : ""} onClick={() => setMobileView("map")}><Map aria-hidden="true" /> Map</button>
    </div>
    <div className="search-explorer" data-mobile-view={mobileView}>
      <section className="search-results-pane" aria-label="Available cars">
        <div className="results-heading"><strong>{vehicles.length} cars nearby</strong><span>{userLocation ? "Sorted by GPS distance" : "Illustrative availability"}</span></div>
        <div className="search-results-scroll">{vehicles.length ? vehicles.map((vehicle, index) => <SearchResultCard key={vehicle.id} vehicle={vehicle} active={vehicle.id === activeId} priority={index < 2} onActive={setActiveId} />) : <div className="empty-results"><Map aria-hidden="true" /><strong>No cars found nearby</strong><p>Try a typed location or increase the search area.</p></div>}</div>
      </section>
      <VehicleMapShell vehicles={vehicles} activeId={activeId} onActive={setActiveId} visible={mobileView === "map"} userLocation={userLocation} />
    </div>
  </>;
}
