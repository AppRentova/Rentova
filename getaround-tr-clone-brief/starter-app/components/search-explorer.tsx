"use client";

import { List, Map } from "lucide-react";
import { useState } from "react";
import type { Vehicle } from "../lib/vehicles";
import { SearchResultCard } from "./search-result-card";
import { VehicleMapShell } from "./vehicle-map-shell";

export function SearchExplorer({ vehicles }: { vehicles: Vehicle[] }) {
  const [activeId, setActiveId] = useState(vehicles[0]?.id ?? null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  return <>
    <div className="search-view-switch" aria-label="Search view">
      <button type="button" className={mobileView === "list" ? "is-active" : ""} onClick={() => setMobileView("list")}><List aria-hidden="true" /> List</button>
      <button type="button" className={mobileView === "map" ? "is-active" : ""} onClick={() => setMobileView("map")}><Map aria-hidden="true" /> Map</button>
    </div>
    <div className="search-explorer" data-mobile-view={mobileView}>
      <section className="search-results-pane" aria-label="Available cars">
        <div className="results-heading"><strong>{vehicles.length} cars nearby</strong><span>Illustrative availability</span></div>
        <div className="search-results-scroll">{vehicles.map((vehicle, index) => <SearchResultCard key={vehicle.id} vehicle={vehicle} active={vehicle.id === activeId} priority={index < 2} onActive={setActiveId} />)}</div>
      </section>
      <VehicleMapShell vehicles={vehicles} activeId={activeId} onActive={setActiveId} visible={mobileView === "map"} />
    </div>
  </>;
}
