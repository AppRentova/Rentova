"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface CarLocation {
  id: string;
  lat: number;
  lng: number;
  brand: string;
  model: string;
  price: number;
  year?: number;
  rating?: number;
  reviewsCount?: number;
  image?: string;
}

interface MapViewProps {
  cars: CarLocation[];
  center?: [number, number];
  zoom?: number;
  onCarClick?: (id: string) => void;
  selectedCarId?: string | null;
  userLocation?: [number, number] | null;
  onLocateMe?: () => void;
  locating?: boolean;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80";

export function MapView({
  cars,
  center = [38.4192, 27.1287],
  zoom = 12,
  onCarClick,
  selectedCarId,
  userLocation,
  onLocateMe,
  locating,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      map.whenReady(() => {
        map.invalidateSize();
        setReady(true);
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setReady(false);
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !ready) return;
    mapRef.current.setView(center, mapRef.current.getZoom(), { animate: true });
  }, [center, ready]);

  useEffect(() => {
    if (!mapRef.current || !ready) return;

    if (userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng(userLocation);
      } else {
        const icon = L.divIcon({
          className: "user-location-marker",
          html: '<div class="h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-md"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        userMarkerRef.current = L.marker(userLocation, { icon }).addTo(mapRef.current);
      }
    } else if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
  }, [userLocation, ready]);

  const handleMarkerClick = useCallback(
    (id: string) => {
      onCarClick?.(id);
    },
    [onCarClick]
  );

  useEffect(() => {
    if (!mapRef.current || !ready) return;
    const map = mapRef.current;

    requestAnimationFrame(() => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      if (cars.length === 0) return;

      cars.forEach((car) => {
        const isSelected = selectedCarId === car.id;
        const rating = car.rating || 4.65;
        const reviewsCount = car.reviewsCount || 42;
        const originalPrice = Math.round(car.price * 1.15);
        const totalPrice = Math.round(car.price * 3);

        const marker = L.marker([car.lat, car.lng], {
          icon: L.divIcon({
            className: "price-bubble-marker",
            html: `<div class="price-bubble ${isSelected ? "selected" : ""}">${car.price} TL</div>`,
            iconSize: [72, 32],
            iconAnchor: [36, 16],
          }),
        })
          .addTo(map)
          .bindPopup(
            `
            <div class="rentova-popup">
              <div class="rentova-popup-image">
                <img src="${car.image || FALLBACK_IMAGE}" alt="${car.brand}" />
                <span>Rentova Connect</span>
              </div>
              <div class="rentova-popup-body">
                <h4>${car.brand} ${car.model} (${car.year || 2018})</h4>
                <div class="rentova-popup-rating">★ ${rating.toFixed(2)} (${reviewsCount})</div>
                <div class="rentova-popup-price">
                  <span>${originalPrice} TL</span>
                  <strong>${car.price} TL</strong>
                  <em>per day • ${totalPrice} TL total</em>
                </div>
              </div>
            </div>
          `,
            { closeButton: false, className: "custom-leaflet-popup" }
          )
          .on("click", () => handleMarkerClick(car.id));

        if (isSelected) marker.openPopup();
        markersRef.current.push(marker);
      });

      if (!selectedCarId) {
        const bounds = L.latLngBounds(cars.map((car) => [car.lat, car.lng]));
        if (bounds.isValid()) map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      } else {
        const activeCar = cars.find((car) => car.id === selectedCarId);
        if (activeCar) map.setView([activeCar.lat, activeCar.lng], 14);
      }

      map.invalidateSize();
    });
  }, [cars, handleMarkerClick, ready, selectedCarId]);

  return (
    <div className="relative h-full w-full" style={{ minHeight: "400px" }}>
      <div ref={mapContainerRef} className="h-full w-full" />
      {onLocateMe && (
        <button
          onClick={onLocateMe}
          disabled={locating}
          className="absolute right-3 top-3 z-[1000] flex items-center gap-1.5 rounded-sm border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-shadow hover:shadow-md disabled:cursor-wait disabled:opacity-50 dark:border-white/10 dark:bg-[#151522] dark:text-gray-100"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
          </svg>
          {locating ? "Bulunuyor..." : "Konumumu Bul"}
        </button>
      )}
    </div>
  );
}
