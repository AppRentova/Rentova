"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CarCard } from "@/components/car/CarCard";
import { useGeolocation } from "@/hooks/useGeolocation";

const MapView = dynamic(() => import("@/components/map/MapView").then((m) => m.MapView), {
  ssr: false,
});

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  transmission: string;
  fuelType: string;
  seats: number;
  pricePerHour: number;
  pricePerDay: number;
  city: string;
  lat: number;
  lng: number;
  images: { url: string; isPrimary: boolean }[];
  owner: { name: string };
  rating?: number;
  reviewsCount?: number;
  distance?: string;
  hasConnect?: boolean;
}

export default function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState("tr");

  const geo = useGeolocation();

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [transmissionFilter, setTransmissionFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  useEffect(() => {
    geo.requestLocation();
  }, [geo.requestLocation]);

  const loadCars = useCallback(async () => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();
      if (minPrice) searchParams.set("minPrice", minPrice);
      if (maxPrice) searchParams.set("maxPrice", maxPrice);
      if (transmissionFilter) searchParams.set("transmission", transmissionFilter);

      const res = await fetch(`/api/cars?${searchParams.toString()}`);
      const data = await res.json();
      setCars(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load cars", err);
    } finally {
      setLoading(false);
    }
  }, [maxPrice, minPrice, transmissionFilter]);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  const handleCarClick = useCallback((id: string) => {
    setSelectedCarId(id);
    const el = document.getElementById(`car-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handlePriceFilter = () => {
    setActiveFilter(null);
    loadCars();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white pt-16">
      <div className="sticky top-16 z-30 flex flex-wrap items-center gap-2 border-b border-gray-100 bg-white px-6 py-3">
        <div className="relative">
          <button
            onClick={() => setActiveFilter(activeFilter === "price" ? null : "price")}
            className={`border px-4 py-2 text-xs font-bold transition-all ${
              activeFilter === "price" || minPrice || maxPrice
                ? "border-transparent bg-[var(--primary-purple)] text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
            } rounded-none`}
          >
            Fiyat
          </button>
          {activeFilter === "price" && (
            <div className="absolute left-0 top-full z-40 mt-2 min-w-[240px] rounded-none border border-gray-100 bg-white p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full rounded-none border border-gray-200 px-3 py-2 text-sm"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-none border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <button
                onClick={handlePriceFilter}
                className="mt-3 w-full rounded-none bg-black py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                Uygula
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              const newVal = transmissionFilter === "AUTOMATIC" ? "" : "AUTOMATIC";
              setTransmissionFilter(newVal);
            }}
            className={`border px-4 py-2 text-xs font-bold transition-all ${
              transmissionFilter
                ? "border-transparent bg-[var(--primary-purple)] text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
            } rounded-none`}
          >
            {transmissionFilter ? "Otomatik" : "Vites Tipi"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="w-full overflow-y-auto p-4 lg:w-[42%] lg:p-5 xl:w-[38%] max-h-[calc(100vh-8rem)]">
          <div className="mb-5">
            <h2 className="text-xl font-extrabold text-[#1d1138]">
              {loading ? "Loading listings..." : `${cars.length} arac bulundu`}
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-56 animate-pulse rounded-none bg-gray-100" />
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div className="rounded-none bg-gray-50 py-20 text-center">
              <h3 className="text-lg font-semibold text-gray-900">Arac bulunamadi</h3>
              <p className="mt-2 text-gray-600">
                Filtreleri kaldirarak tum araclari goruntuleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cars.map((car) => (
                <div
                  key={car.id}
                  id={`car-${car.id}`}
                  onClick={() => setSelectedCarId(car.id)}
                  className={`cursor-pointer transition-all ${
                    selectedCarId === car.id ? "ring-2 ring-[var(--primary-purple)]" : ""
                  }`}
                >
                  <CarCard car={car} t={(key) => key} locale={locale} compact />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden h-[calc(100vh-8rem)] border-l border-gray-100 bg-gray-50 p-4 lg:sticky lg:top-32 lg:block lg:w-[58%] xl:w-[62%]">
          <MapView
            cars={cars.map((c) => ({
              id: c.id,
              lat: c.lat,
              lng: c.lng,
              brand: c.brand,
              model: c.model,
              price: c.pricePerDay,
              year: c.year,
              rating: c.rating,
              reviewsCount: c.reviewsCount,
              image: c.images[0]?.url,
            }))}
            onCarClick={handleCarClick}
            selectedCarId={selectedCarId}
            userLocation={geo.latitude !== null && geo.longitude !== null ? [geo.latitude, geo.longitude] : null}
            onLocateMe={geo.requestLocation}
            locating={geo.loading}
          />
        </div>
      </div>
    </div>
  );
}
