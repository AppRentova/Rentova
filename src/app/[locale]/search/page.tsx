"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
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

const vehicleTypes = ["Commercial", "City", "Sedan", "Family", "Minibus", "4x4", "Coupe", "SUV"];
const featureFilters = ["GPS", "Air conditioning", "Baby seat", "Bike rack"];
const fuelTypes = ["Electric", "Hybrid", "Combustion"];

export default function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState("tr");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [transmissionFilter, setTransmissionFilter] = useState("");
  const [seatFilter, setSeatFilter] = useState(2);
  const [instantBooking, setInstantBooking] = useState(false);
  const [newCarsOnly, setNewCarsOnly] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"vehicle" | "pickup" | "price" | null>(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [searchLabel, setSearchLabel] = useState("Konumum");

  const geo = useGeolocation();
  const urlParams = useSearchParams();
  const urlCity = urlParams.get("city") || urlParams.get("q") || "";
  const urlLat = urlParams.get("lat");
  const urlLng = urlParams.get("lng");

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  useEffect(() => {
    geo.requestLocation();
  }, [geo.requestLocation]);

  useEffect(() => {
    if (urlCity) setSearchLabel(urlCity);
    else if (urlLat && urlLng) setSearchLabel("GPS konumun");
  }, [urlCity, urlLat, urlLng]);

  const loadCars = useCallback(async () => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();
      if (minPrice) searchParams.set("minPrice", minPrice);
      if (maxPrice) searchParams.set("maxPrice", maxPrice);
      if (transmissionFilter) searchParams.set("transmission", transmissionFilter);
      if (seatFilter > 2) searchParams.set("seats", String(seatFilter));
      if (urlCity) searchParams.set("city", urlCity);
      if (urlLat && urlLng) {
        searchParams.set("lat", urlLat);
        searchParams.set("lng", urlLng);
      } else if (geo.latitude !== null && geo.longitude !== null) {
        searchParams.set("lat", String(geo.latitude));
        searchParams.set("lng", String(geo.longitude));
      }

      const res = await fetch(`/api/cars?${searchParams.toString()}`);
      const data = await res.json();
      setCars(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load cars", err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [geo.latitude, geo.longitude, maxPrice, minPrice, seatFilter, transmissionFilter, urlCity, urlLat, urlLng]);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (newCarsOnly && car.year < new Date().getFullYear() - 5) return false;
      return true;
    });
  }, [cars, newCarsOnly]);

  const handleCarClick = useCallback((id: string) => {
    setSelectedCarId(id);
    const el = document.getElementById(`car-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const applyFilters = () => {
    setActiveDropdown(null);
    setShowMoreFilters(false);
    loadCars();
  };

  const handleLocateMe = () => {
    setSearchLabel("GPS konumun");
    geo.requestLocation();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white pt-16 dark:bg-[#0c0c12]">
      <div className="sticky top-16 z-30 border-b border-gray-100 bg-white dark:border-white/10 dark:bg-[#101018]">
        <div className="flex flex-wrap items-center gap-3 px-5 py-3">
          <div className="flex min-w-[260px] flex-1 items-center gap-3 border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#1d1138] dark:border-white/10 dark:bg-[#141420] dark:text-gray-100 lg:max-w-md">
            <span className="text-[var(--primary-purple)]">⌖</span>
            <span>{searchLabel}</span>
            <button type="button" className="ml-auto text-gray-400" aria-label="Clear location">
              x
            </button>
          </div>

          <div className="grid w-full grid-cols-2 border border-gray-200 bg-white text-sm text-gray-600 dark:border-white/10 dark:bg-[#141420] dark:text-gray-300 sm:w-auto">
            <button className="border-r border-gray-200 px-4 py-3 text-left dark:border-white/10">Pickup</button>
            <button className="px-4 py-3 text-left">Return</button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 px-5 py-3 dark:border-white/10">
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "price" ? null : "price")}
              className="border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-[var(--primary-purple)] transition hover:border-[var(--primary-purple)] dark:border-white/10 dark:bg-[#141420]"
            >
              Total price
            </button>
            {activeDropdown === "price" && (
              <div className="absolute left-0 top-full z-40 mt-2 min-w-[260px] border border-gray-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-[#151522]">
                <div className="flex items-center gap-2">
                  <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} type="number" placeholder="Min" className="w-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-[#101018] dark:text-gray-100" />
                  <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} type="number" placeholder="Max" className="w-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-[#101018] dark:text-gray-100" />
                </div>
                <button onClick={applyFilters} className="mt-3 w-full bg-[var(--primary-purple)] px-4 py-2 text-sm font-bold text-white">
                  Apply
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "vehicle" ? null : "vehicle")}
              className="border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-[var(--primary-purple)] transition hover:border-[var(--primary-purple)] dark:border-white/10 dark:bg-[#141420]"
            >
              Vehicle type
            </button>
            {activeDropdown === "vehicle" && (
              <div className="absolute left-0 top-full z-40 mt-2 w-[min(500px,92vw)] border border-gray-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#151522]">
                <p className="mb-4 text-xs font-extrabold uppercase text-gray-500">Vehicle type</p>
                <div className="flex flex-wrap gap-2">
                  {vehicleTypes.map((type) => (
                    <button key={type} type="button" className="border border-gray-200 px-4 py-2 text-sm font-medium text-[#1d1138] dark:border-white/10 dark:text-gray-100">
                      {type}
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex justify-end gap-3">
                  <button type="button" className="border border-gray-200 px-4 py-2 text-sm font-bold text-[var(--primary-purple)] dark:border-white/10" onClick={() => setActiveDropdown(null)}>
                    Reset
                  </button>
                  <button type="button" className="bg-[var(--primary-purple)] px-5 py-2 text-sm font-bold text-white" onClick={applyFilters}>
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveDropdown(activeDropdown === "pickup" ? null : "pickup")}
            className="border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-[var(--primary-purple)] transition hover:border-[var(--primary-purple)] dark:border-white/10 dark:bg-[#141420]"
          >
            Pickup method
          </button>

          <button
            onClick={() => setShowMoreFilters(true)}
            className="border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-[var(--primary-purple)] transition hover:border-[var(--primary-purple)] dark:border-white/10 dark:bg-[#141420]"
          >
            More filters
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="max-h-[calc(100vh-8rem)] w-full overflow-y-auto p-4 lg:w-[36%] lg:p-5">
          <h2 className="mb-5 text-xl font-extrabold text-[#1d1138] dark:text-white">
            {loading ? "Loading listings..." : `${filteredCars.length} arac bulundu`}
          </h2>

          {loading ? (
            <div className="flex flex-col gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-56 animate-pulse bg-gray-100 dark:bg-white/10" />
              ))}
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="bg-gray-50 py-20 text-center dark:bg-[#141420]">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Arac bulunamadi</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Filtreleri kaldirarak tum araclari goruntuleyebilirsiniz.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredCars.map((car) => (
                <div
                  key={car.id}
                  id={`car-${car.id}`}
                  onClick={() => setSelectedCarId(car.id)}
                  className={`cursor-pointer transition-all ${selectedCarId === car.id ? "ring-2 ring-[var(--primary-purple)]" : ""}`}
                >
                  <CarCard car={car} t={(key) => key} locale={locale} compact />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden h-[calc(100vh-8rem)] border-l border-gray-100 bg-gray-50 p-3 dark:border-white/10 dark:bg-[#101018] lg:sticky lg:top-32 lg:block lg:w-[64%]">
          <MapView
            cars={filteredCars.map((c) => ({
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
            onLocateMe={handleLocateMe}
            locating={geo.loading}
          />
        </div>
      </div>

      {showMoreFilters && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#151522]">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5 dark:border-white/10 dark:bg-[#151522]">
              <h3 className="text-2xl font-extrabold text-[#1d1138] dark:text-white">Filters</h3>
              <button onClick={() => setShowMoreFilters(false)} className="border border-gray-300 px-2 py-1 text-xl leading-none dark:border-white/20 dark:text-white" aria-label="Close filters">
                x
              </button>
            </div>

            <div className="space-y-8 px-6 py-6">
              <label className="flex items-center justify-between gap-4">
                <span>
                  <span className="block font-bold text-[#1d1138] dark:text-white">Instant booking</span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">Vehicles you can book without waiting for owner approval</span>
                </span>
                <input type="checkbox" checked={instantBooking} onChange={(e) => setInstantBooking(e.target.checked)} className="h-5 w-5 accent-[var(--primary-purple)]" />
              </label>

              <section className="border-t border-gray-200 pt-6 dark:border-white/10">
                <p className="mb-4 text-xs font-extrabold uppercase text-gray-500">Number of seats</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-200">Minimum seats</span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSeatFilter((value) => Math.max(2, value - 1))} className="h-10 w-10 border border-gray-200 text-xl dark:border-white/10 dark:text-white">-</button>
                    <span className="w-6 text-center font-bold dark:text-white">{seatFilter}</span>
                    <button onClick={() => setSeatFilter((value) => Math.min(9, value + 1))} className="h-10 w-10 border border-gray-200 text-xl text-[var(--primary-purple)] dark:border-white/10">+</button>
                  </div>
                </div>
              </section>

              <label className="flex items-center justify-between gap-4 border-t border-gray-200 pt-6 dark:border-white/10">
                <span>
                  <span className="block font-bold text-[#1d1138] dark:text-white">New cars only</span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">Less than 5 years</span>
                </span>
                <input type="checkbox" checked={newCarsOnly} onChange={(e) => setNewCarsOnly(e.target.checked)} className="h-5 w-5 accent-[var(--primary-purple)]" />
              </label>

              <section className="border-t border-gray-200 pt-6 dark:border-white/10">
                <p className="mb-4 text-xs font-extrabold uppercase text-gray-500">Features</p>
                <div className="flex flex-wrap gap-2">
                  {featureFilters.map((feature) => (
                    <button key={feature} type="button" className="border border-gray-200 px-4 py-2 text-sm text-[#1d1138] dark:border-white/10 dark:text-gray-100">
                      {feature}
                    </button>
                  ))}
                </div>
              </section>

              <section className="border-t border-gray-200 pt-6 dark:border-white/10">
                <p className="mb-4 text-xs font-extrabold uppercase text-gray-500">Transmission</p>
                <div className="space-y-3 text-[#1d1138] dark:text-gray-100">
                  {[
                    ["", "All"],
                    ["MANUAL", "Manual only"],
                    ["AUTOMATIC", "Automatic only"],
                  ].map(([value, label]) => (
                    <label key={label} className="flex items-center gap-3">
                      <input type="radio" name="transmission" value={value} checked={transmissionFilter === value} onChange={() => setTransmissionFilter(value)} className="h-5 w-5 accent-[var(--primary-purple)]" />
                      {label}
                    </label>
                  ))}
                </div>
              </section>

              <section className="border-t border-gray-200 pt-6 dark:border-white/10">
                <p className="mb-4 text-xs font-extrabold uppercase text-gray-500">Fuel type</p>
                <div className="flex flex-wrap gap-4 text-[#1d1138] dark:text-gray-100">
                  {fuelTypes.map((fuel) => (
                    <label key={fuel} className="flex items-center gap-2">
                      <input type="checkbox" className="h-5 w-5 accent-[var(--primary-purple)]" />
                      {fuel}
                    </label>
                  ))}
                </div>
              </section>
            </div>

            <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#151522]">
              <button onClick={applyFilters} className="w-full bg-[var(--primary-purple)] px-6 py-3 text-base font-bold text-white">
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
