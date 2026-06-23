"use client";

import { useState, useCallback } from "react";

interface BookingCar {
  id: string;
  brand: string;
  model: string;
  year: number;
  images: { url: string; isPrimary: boolean }[];
}

interface Booking {
  id: string;
  carId: string;
  renterId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  car: BookingCar;
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Rezervasyonlar yüklenemedi");
      setBookings(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (carId: string, startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId, startDate, endDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rezervasyon başarısız");
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (bookingId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings?id=${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "İptal başarısız");
      setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: "CANCELLED" } : b));
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { bookings, loading, error, fetchBookings, createBooking, cancelBooking };
}
