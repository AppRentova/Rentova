"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { CarCard } from "@/components/car/CarCard";
import { useGeolocation } from "@/hooks/useGeolocation";

const MapView = dynamic(
  () => import("@/components/map/MapView").then((m) => m.MapView),
  { ssr: false }
);

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
  }, []);

  async function loadCars() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (transmissionFilter) params.set("transmission", transmissionFilter);

      const res = await fetch(`/api/cars?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setCars(data);
      } else {
        setCars([]);
      }
    } catch (err) {
      console.error("Failed to load cars", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCars();
  }, [minPrice, maxPrice, transmissionFilter]);

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
    <div className="w-full min-h-screen bg-white pt-16 flex flex-col">
      {/* Top Filter Bar */}
      <div className="border-b border-gray-100 py-3 px-6 bg-white sticky top-16 z-30 flex flex-wrap gap-2 items-center">
        <div className="relative">
          <button
            onClick={() => setActiveFilter(activeFilter === "price" ? null : "price")}
            className={`px-4 py-2 rounded-sm text-xs font-bold border transition-all ${
              activeFilter === "price" || minPrice || maxPrice
                ? "bg-[var(--primary-purple)] text-white border-transparent"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
            }`}
          >
            Fiyat
          </button>
          {activeFilter === "price" && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-sm p-4 shadow-lg z-40 min-w-[240px]">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm"
                />
              </div>
              <button onClick={handlePriceFilter} className="mt-3 w-full bg-black text-white text-sm font-medium py-2 rounded-sm hover:bg-gray-800 transition-colors">
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
            className={`px-4 py-2 rounded-sm text-xs font-bold border transition-all ${
              transmissionFilter
                ? "bg-[var(--primary-purple)] text-white border-transparent"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
            }`}
          >
            {transmissionFilter ? "Otomatik" : "Vites Tipi"}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Column (List) */}
        <div className="w-full lg:w-[55%] p-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-[#1d1138]">
              {loading ? "Loading listings..." : `${cars.length} araç bulundu`}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-sm h-80 animate-pulse" />
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-sm">
              <h3 className="text-lg font-semibold text-gray-900">Araç bulunamadı</h3>
              <p className="text-gray-600 mt-2">Filtreleri kaldırarak tüm araçları görüntüleyebilirsiniz.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {cars.map((car) => (
                <div
                  key={car.id}
                  id={`car-${car.id}`}
                  onClick={() => setSelectedCarId(car.id)}
                  className={`cursor-pointer rounded-sm transition-all ${
                    selectedCarId === car.id ? "ring-2 ring-[var(--primary-purple)]" : ""
                  }`}
                >
                  <CarCard car={car} t={(key) => key} locale={locale} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (Map) */}
        <div className="hidden lg:block lg:w-[45%] h-[calc(100vh-8rem)] sticky top-32 z-10 p-6 bg-gray-50 border-l border-gray-100">
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
            userLocation={geo.latitude && geo.longitude ? [geo.latitude, geo.longitude] : null}
            onLocateMe={geo.requestLocation}
            locating={geo.loading}
          />
        </div>
      </div>
    </div>
  );
}

