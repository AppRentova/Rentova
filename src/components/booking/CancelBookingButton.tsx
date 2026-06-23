"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CancelBookingButton({ bookingId, locale }: { bookingId: string; locale: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCancel() {
    if (!confirm("Rezervasyonu iptal etmek istediğinize emin misiniz?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?id=${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "İptal başarısız");
        return;
      }
      router.refresh();
    } catch {
      alert("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
    >
      {loading ? "İptal ediliyor..." : "İptal Et"}
    </button>
  );
}
