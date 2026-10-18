"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import type { Vehicle } from "../lib/vehicles";
import { formatCurrency } from "../lib/i18n";

function createPopup(vehicle: Vehicle) {
  const card = document.createElement("article");
  card.className = "map-popup-card";

  const image = document.createElement("img");
  image.src = vehicle.image;
  image.alt = "";
  image.width = 280;
  image.height = 132;

  const content = document.createElement("div");
  content.className = "map-popup-content";

  const heading = document.createElement("div");
  heading.className = "map-popup-heading";
  const identity = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = vehicle.name;
  const place = document.createElement("span");
  place.textContent = `${vehicle.district}, ${vehicle.city}`;
  identity.append(name, place);
  const rating = document.createElement("span");
  rating.setAttribute("aria-label", `Rated ${vehicle.rating} out of 5`);
  rating.textContent = `★ ${vehicle.rating}`;
  heading.append(identity, rating);

  const meta = document.createElement("div");
  meta.className = "map-popup-meta";
  const distance = document.createElement("span");
  distance.textContent = `${vehicle.distance} away`;
  const price = document.createElement("strong");
  price.textContent = `${formatCurrency(vehicle.dailyPrice)} `;
  const priceUnit = document.createElement("small");
  priceUnit.textContent = "/ day";
  price.append(priceUnit);
  meta.append(distance, price);

  const link = document.createElement("a");
  link.href = `/cars/${vehicle.id}`;
  link.textContent = "View car details";
  link.className = "map-popup-link";
  content.append(heading, meta, link);
  card.append(image, content);
  return card;
}

export function VehicleMap({ vehicles, activeId, onActive }: { vehicles: Vehicle[]; activeId: string | null; onActive: (id: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef(new Map<string, Marker>());
  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;

  useEffect(() => {
    let disposed = false;

    async function initialiseMap() {
      if (!containerRef.current || mapRef.current) return;
      const L = await import("leaflet");
      if (disposed || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        attributionControl: true,
        scrollWheelZoom: false,
        zoomControl: false,
      });
      mapRef.current = map;

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      const bounds = L.latLngBounds([]);
      vehicles.forEach((vehicle) => {
        const price = formatCurrency(vehicle.dailyPrice);
        const icon = L.divIcon({
          className: "rentova-map-marker",
          html: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 17H3v-5l2-5h14l2 5v5h-2m-14 0v2m14-2v2M5 12h14M7 15h.01M17 15h.01M7 7l1-3h8l1 3"/></svg><span>${price}</span>`,
          iconSize: [84, 36],
          iconAnchor: [42, 18],
          popupAnchor: [0, -22],
        });
        const marker = L.marker(vehicle.location, {
          icon,
          keyboard: true,
          riseOnHover: true,
          title: `${vehicle.name}, ${vehicle.district}, ${price} per day`,
        }).addTo(map);

        marker.bindPopup(createPopup(vehicle), {
          className: "rentova-map-popup",
          closeButton: true,
          maxWidth: 280,
          minWidth: 260,
          autoPanPadding: L.point(28, 28),
        });
        marker.on("mouseover focus click", () => { onActiveRef.current(vehicle.id); marker.openPopup(); });
        const element = marker.getElement();
        element?.setAttribute("role", "button");
        element?.setAttribute("aria-label", `${vehicle.name} in ${vehicle.district}, ${price} per day`);
        markersRef.current.set(vehicle.id, marker);
        bounds.extend(vehicle.location);
      });

      if (bounds.isValid()) map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13 });
      requestAnimationFrame(() => map.invalidateSize());
    }

    initialiseMap();
    return () => {
      disposed = true;
      markersRef.current.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [vehicles]);

  useEffect(() => {
    if (!activeId) return;
    const marker = markersRef.current.get(activeId);
    marker?.openPopup();
  }, [activeId]);

  return <div ref={containerRef} className="vehicle-map" aria-label="Map showing approximate vehicle locations" />;
}
