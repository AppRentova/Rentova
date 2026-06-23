"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

export function MapView({ cars, center = [38.4192, 27.1287], zoom = 12, onCarClick, selectedCarId, userLocation, onLocateMe, locating }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const container = mapContainerRef.current;
      const map = L.map(container, {
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
  }, [center[0], center[1], ready]);

  useEffect(() => {
    if (!mapRef.current || !ready) return;
    if (userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng(userLocation);
      } else {
        const icon = L.divIcon({
          className: "user-location-marker",
          html: '<div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-md" />',
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

  useEffect(() => {
    if (!mapRef.current || !ready) return;

    const map = mapRef.current;

    requestAnimationFrame(() => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      if (cars.length === 0) return;

      cars.forEach((car) => {
        const isSelected = selectedCarId === car.id;
        const markerHtml = `
          <div class="price-bubble ${isSelected ? 'selected' : ''}">
            €${car.price}
          </div>
        `;

        const carImage = car.image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80";
        const rating = car.rating || 4.65;
        const reviewsCount = car.reviewsCount || 42;
        const originalPrice = Math.round(car.price * 1.15);
        const totalPrice = Math.round(car.price * 3);

        const popupHtml = `
          <div class="w-60 bg-white rounded-sm overflow-hidden font-sans">
            <div class="relative h-32 bg-gray-100">
              <img src="${carImage}" alt="${car.brand}" class="w-full h-full object-cover" />
              <span class="absolute top-2 left-2 bg-white text-[#1d1138] text-[8px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-sm">
                Rentova Connect
              </span>
            </div>
            <div class="p-3">
              <h4 class="font-bold text-sm text-[#1d1138]">${car.brand} ${car.model} (${car.year || 2018})</h4>
              <div class="flex items-center text-xs font-semibold text-gray-500 mt-1">
                <span class="text-purple-700 mr-1">★ ${rating.toFixed(2)}</span>
                <span>(${reviewsCount})</span>
              </div>
              <div class="mt-2.5 pt-2 border-t border-gray-100 flex items-baseline gap-1 text-[11px] font-bold text-gray-500">
                <span class="line-through">€${originalPrice}</span>
                <span class="text-[#1d1138] text-sm font-extrabold">€${car.price}</span>
                <span>per day • €${totalPrice} total</span>
              </div>
            </div>
          </div>
        `;

        const marker = L.marker([car.lat, car.lng], {
          icon: L.divIcon({
            className: "price-bubble-marker",
            html: markerHtml,
            iconSize: [60, 32],
            iconAnchor: [30, 16],
          }),
        })
          .addTo(map)
          .bindPopup(popupHtml, {
            closeButton: false,
            className: "custom-leaflet-popup",
          })
          .on("click", () => {
            onCarClick?.(car.id);
          });

        if (isSelected) {
          marker.openPopup();
        }

        markersRef.current.push(marker);
      });

      if (!selectedCarId && cars.length > 0) {
        const bounds = L.latLngBounds(cars.map((c) => [c.lat, c.lng]));
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        }
      } else if (selectedCarId) {
        const activeCar = cars.find((c) => c.id === selectedCarId);
        if (activeCar) {
          map.setView([activeCar.lat, activeCar.lng], 14);
        }
      }

      map.invalidateSize();
    });
  }, [cars, selectedCarId, onCarClick, ready]);

  return (
    <div className="relative w-full h-full" style={{ minHeight: "400px" }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      {onLocateMe && (
        <button
          onClick={onLocateMe}
          disabled={locating}
          className="absolute top-3 right-3 z-[1000] bg-white border border-gray-200 rounded-sm px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-wait flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
          </svg>
          {locating ? "Bulunuyor..." : "Konumumu Bul"}
        </button>
      )}
    </div>
  );
}
