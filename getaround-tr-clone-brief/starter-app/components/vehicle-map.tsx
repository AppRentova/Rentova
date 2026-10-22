"use client";

import { useEffect, useRef } from "react";
import type { Map as MapLibreMap, Popup } from "maplibre-gl";
import type { Coordinates } from "../lib/geo";
import type { Vehicle } from "../lib/vehicles";
import { formatCurrency } from "../lib/i18n";

const DEFAULT_MAP_STYLE = "https://tiles.openfreemap.org/styles/bright";
const SOURCE_ID = "rentova-vehicles";
const LAYER_ID = "rentova-price-pins";

function createPopup(vehicle: Vehicle) {
  const card = document.createElement("article");
  card.className = "map-popup-card";
  const image = document.createElement("img");
  image.src = vehicle.image;
  image.alt = "";
  image.width = 280;
  image.height = 132;
  image.loading = "lazy";
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

function createPillImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 80;
  canvas.height = 72;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not supported");
  context.shadowColor = "rgba(48, 38, 82, .24)";
  context.shadowBlur = 10;
  context.shadowOffsetY = 5;
  context.fillStyle = "#ffffff";
  context.strokeStyle = "#e2dde8";
  context.lineWidth = 2;
  context.beginPath();
  context.roundRect(8, 8, 64, 52, 8);
  context.fill();
  context.stroke();
  return context.getImageData(0, 0, 80, 72);
}

export function VehicleMap({ vehicles, activeId, onActive, userLocation }: { vehicles: Vehicle[]; activeId: string | null; onActive: (id: string) => void; userLocation: Coordinates | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const activeIdRef = useRef(activeId);
  const onActiveRef = useRef(onActive);
  activeIdRef.current = activeId;
  onActiveRef.current = onActive;

  useEffect(() => {
    let disposed = false;
    async function initialiseMap() {
      if (!containerRef.current || mapRef.current) return;
      const maplibre = await import("maplibre-gl");
      if (disposed || !containerRef.current) return;
      maplibre.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
      const map = new maplibre.Map({
        container: containerRef.current,
        style: process.env.NEXT_PUBLIC_MAP_STYLE_URL || DEFAULT_MAP_STYLE,
        center: [29.01, 41.02],
        zoom: 10.5,
        attributionControl: { compact: true },
        dragRotate: false,
        pitchWithRotate: false,
        cooperativeGestures: true,
      });
      mapRef.current = map;
      map.addControl(new maplibre.NavigationControl({ showCompass: false }), "bottom-right");
      const bounds = new maplibre.LngLatBounds();
      const vehicleById = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));
      const data = {
        type: "FeatureCollection" as const,
        features: vehicles.map((vehicle) => {
          const coordinates: [number, number] = [vehicle.location.lng, vehicle.location.lat];
          bounds.extend(coordinates);
          return {
            type: "Feature" as const,
            geometry: { type: "Point" as const, coordinates },
            properties: { id: vehicle.id, price: formatCurrency(vehicle.dailyPrice) },
          };
        }),
      };

      const showPopup = (vehicle: Vehicle) => {
        popupRef.current?.remove();
        popupRef.current = new maplibre.Popup({ className: "rentova-map-popup", closeButton: true, closeOnClick: false, maxWidth: "280px", offset: 22 })
          .setLngLat([vehicle.location.lng, vehicle.location.lat])
          .setDOMContent(createPopup(vehicle))
          .addTo(map);
        onActiveRef.current(vehicle.id);
      };

      map.on("load", () => {
        if (disposed) return;
        map.addImage("rentova-price-pill", createPillImage(), {
          pixelRatio: 2,
          stretchX: [[20, 60]],
          stretchY: [[20, 52]],
          content: [16, 12, 64, 60],
        });
        map.addSource(SOURCE_ID, { type: "geojson", data });
        map.addLayer({
          id: LAYER_ID,
          type: "symbol",
          source: SOURCE_ID,
          layout: {
            "icon-image": "rentova-price-pill",
            "icon-text-fit": "both",
            "icon-text-fit-padding": [8, 12, 8, 12],
            "icon-allow-overlap": true,
            "text-field": ["get", "price"],
            "text-size": 12,
            "text-font": ["Noto Sans Bold"],
            "text-allow-overlap": true,
          },
          paint: { "text-color": "#302652" },
        });
        if (userLocation) {
          map.addSource("rentova-user-location", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "Point", coordinates: [userLocation.lng, userLocation.lat] } } });
          map.addLayer({ id: "rentova-user-location-halo", type: "circle", source: "rentova-user-location", paint: { "circle-radius": 13, "circle-color": "#ffffff", "circle-opacity": 0.9 } });
          map.addLayer({ id: "rentova-user-location", type: "circle", source: "rentova-user-location", paint: { "circle-radius": 7, "circle-color": "#8c01de", "circle-stroke-width": 2, "circle-stroke-color": "#ffffff" } });
          bounds.extend([userLocation.lng, userLocation.lat]);
        }
        map.on("mouseenter", LAYER_ID, (event) => {
          map.getCanvas().style.cursor = "pointer";
          const id = event.features?.[0]?.properties?.id;
          const vehicle = typeof id === "string" ? vehicleById.get(id) : undefined;
          if (vehicle) showPopup(vehicle);
        });
        map.on("mouseleave", LAYER_ID, () => { map.getCanvas().style.cursor = ""; });
        map.on("click", LAYER_ID, (event) => {
          const id = event.features?.[0]?.properties?.id;
          const vehicle = typeof id === "string" ? vehicleById.get(id) : undefined;
          if (vehicle) showPopup(vehicle);
        });
        if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 68, maxZoom: 12.8, duration: 0 });
        const initiallyActive = activeIdRef.current ? vehicleById.get(activeIdRef.current) : undefined;
        if (initiallyActive) showPopup(initiallyActive);
        map.resize();
      });
    }
    initialiseMap();
    return () => {
      disposed = true;
      popupRef.current?.remove();
      popupRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [vehicles, userLocation]);

  useEffect(() => {
    if (!activeId || !mapRef.current?.isStyleLoaded()) return;
    const vehicle = vehicles.find((item) => item.id === activeId);
    if (!vehicle) return;
    void import("maplibre-gl").then(({ Popup: MapPopup }) => {
      popupRef.current?.remove();
      popupRef.current = new MapPopup({ className: "rentova-map-popup", closeButton: true, closeOnClick: false, maxWidth: "280px", offset: 22 })
        .setLngLat([vehicle.location.lng, vehicle.location.lat])
        .setDOMContent(createPopup(vehicle))
        .addTo(mapRef.current!);
    });
  }, [activeId, vehicles]);

  return <div ref={containerRef} className="vehicle-map" data-marker-count={vehicles.length} aria-label="Map showing approximate vehicle locations" />;
}
