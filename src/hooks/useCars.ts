"use client";

import { useState, useEffect, useCallback } from "react";

interface CarImage {
  url: string;
  isPrimary: boolean;
}

interface CarOwner {
  name: string;
  id?: string;
  image?: string | null;
  createdAt?: string;
}

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
  deposit: number;
  description: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  isActive: boolean;
  images: CarImage[];
  owner: CarOwner;
  createdAt: string;
}

interface CarFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  transmission?: string;
  seats?: number;
}

export function useCars(filters?: CarFilters) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = useCallback(async (f?: CarFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (f?.city) params.set("city", f.city);
      if (f?.minPrice) params.set("minPrice", String(f.minPrice));
      if (f?.maxPrice) params.set("maxPrice", String(f.maxPrice));
      if (f?.transmission) params.set("transmission", f.transmission);
      if (f?.seats) params.set("seats", String(f.seats));

      const res = await fetch(`/api/cars?${params.toString()}`);
      if (!res.ok) throw new Error("Araçlar yüklenemedi");
      const data = await res.json();
      setCars(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars(filters);
  }, [filters, fetchCars]);

  const getCar = useCallback(async (id: string): Promise<Car | null> => {
    try {
      const res = await fetch(`/api/cars/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }, []);

  return { cars, loading, error, refetch: () => fetchCars(filters), getCar };
}

export function useCar(id: string) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/cars/${id}`);
        if (!res.ok) throw new Error("Araç bulunamadı");
        setCar(await res.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  return { car, loading, error };
}
