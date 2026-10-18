"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
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

export function VehicleMap({ vehicles }: { vehicles: Vehicle[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

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
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const bounds = L.latLngBounds([]);
      vehicles.forEach((vehicle) => {
        const price = formatCurrency(vehicle.dailyPrice);
        const icon = L.divIcon({
          className: "rentova-map-marker",
          html: `<span>${price}</span>`,
          iconSize: [88, 38],
          iconAnchor: [44, 38],
          popupAnchor: [0, -34],
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
        marker.on("mouseover focus click", () => marker.openPopup());
        const element = marker.getElement();
        element?.setAttribute("role", "button");
        element?.setAttribute("aria-label", `${vehicle.name} in ${vehicle.district}, ${price} per day`);
        bounds.extend(vehicle.location);
      });

      if (bounds.isValid()) map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13 });
      requestAnimationFrame(() => map.invalidateSize());
    }

    initialiseMap();
    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [vehicles]);

  return <div ref={containerRef} className="vehicle-map" aria-label="Map showing approximate vehicle locations" />;
}
