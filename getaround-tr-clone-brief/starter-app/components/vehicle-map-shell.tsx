"use client";

import dynamic from "next/dynamic";
import { Map, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Vehicle } from "../lib/vehicles";

const VehicleMap = dynamic(() => import("./vehicle-map").then((module) => module.VehicleMap), {
  ssr: false,
  loading: () => <div className="map-loading" role="status" aria-live="polite"><MapPin aria-hidden="true" /><span>Loading map…</span></div>,
});

export function VehicleMapShell({ vehicles }: { vehicles: Vehicle[] }) {
  const shellRef = useRef<HTMLElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isCompact, setIsCompact] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px), (pointer: coarse)");
    const updateMode = () => setIsCompact(media.matches);
    updateMode();
    media.addEventListener("change", updateMode);

    if (!media.matches && shellRef.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      }, { rootMargin: "180px" });
      observer.observe(shellRef.current);
      return () => {
        media.removeEventListener("change", updateMode);
        observer.disconnect();
      };
    }

    return () => media.removeEventListener("change", updateMode);
  }, []);

  return <section ref={shellRef} className="map-shell" aria-labelledby="map-title">
    <div className="map-toolbar">
      <div><h2 id="map-title">Cars on the map</h2><p>Pins show approximate neighbourhood locations.</p></div>
      <span><MapPin aria-hidden="true" /> {vehicles.length} cars</span>
    </div>
    {shouldLoad ? <VehicleMap vehicles={vehicles} /> : <div className="map-consent">
      <Map aria-hidden="true" />
      <strong>{isCompact ? "Explore nearby cars" : "Map ready to load"}</strong>
      <p>The map loads only when you choose to view it, saving mobile data and battery.</p>
      <button className="button button-dark" type="button" onClick={() => setShouldLoad(true)}>Open map</button>
    </div>}
  </section>;
}
