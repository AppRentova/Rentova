"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui";
import { useGeolocation } from "@/hooks/useGeolocation";

const MapView = dynamic(
  () => import("@/components/map/MapView").then((m) => m.MapView),
  { ssr: false }
);

interface CarDetail {
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
  images: { url: string; isPrimary: boolean }[];
  owner: {
    id: string;
    name: string;
    image: string | null;
    createdAt: string;
  };
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    reviewer: { name: string; image: string | null };
  }[];
}

export default function CarDetailPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const router = useRouter();
  const [car, setCar] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState("tr");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [mainImage, setMainImage] = useState(0);
  const geo = useGeolocation();

  useEffect(() => { geo.requestLocation(); }, []);

  useEffect(() => {
    async function loadCar() {
      try {
        const { id, locale: loc } = await params;
        setLocale(loc);
        const res = await fetch(`/api/cars/${id}`);
        const data = await res.json();
        setCar(data);
      } catch (err) {
        console.error("Failed to load car", err);
      } finally {
        setLoading(false);
      }
    }
    loadCar();
  }, [params]);

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError("");
    setBookingSuccess(false);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId: car!.id, startDate, endDate }),
      });

      if (!res.ok) {
        const data = await res.json();
        setBookingError(data.error || "Rezervasyon başarısız");
        return;
      }

      setBookingSuccess(true);
    } catch {
      setBookingError("Bir hata oluştu");
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-96 bg-gray-200 rounded-sm" />
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Araç bulunamadı</h2>
        <Button className="mt-4" onClick={() => router.back()}>Geri Dön</Button>
      </div>
    );
  }

  const days = startDate && endDate
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const totalPrice = days > 0 ? days * car.pricePerDay : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-2">
            <div className="aspect-[16/9] bg-gray-100 rounded-sm overflow-hidden">
              {(car.images && car.images[mainImage]?.url) ? (
                <img
                  src={car.images[mainImage].url}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              )}
            </div>
            {car.images && car.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {car.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 transition-colors ${
                      mainImage === i ? "border-black" : "border-transparent"
                    }`}
                  >
                    {img.url ? (
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </button>
                ))}
              </div>
            )}

          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {car.brand} {car.model} <span className="text-gray-400 font-normal">{car.year}</span>
            </h1>

            <div className="flex flex-wrap gap-4 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
                {car.seats} Koltuk
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
                {car.transmission === "AUTOMATIC" ? "Otomatik" : "Manuel"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
                {car.fuelType === "GASOLINE" ? "Benzin" : car.fuelType === "DIESEL" ? "Dizel" : car.fuelType === "ELECTRIC" ? "Elektrik" : car.fuelType === "HYBRID" ? "Hibrit" : "LPG"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
                {car.city}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Açıklama</h2>
            <p className="text-gray-600 leading-relaxed">{car.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Konum</h2>
            <p className="text-gray-600 mb-3">{car.address}</p>
            <div className="h-64 rounded-sm overflow-hidden">
              <MapView
                cars={[{ id: car.id, lat: car.lat, lng: car.lng, brand: car.brand, model: car.model, price: car.pricePerDay }]}
                center={[car.lat, car.lng]}
                zoom={15}
                userLocation={geo.latitude && geo.longitude ? [geo.latitude, geo.longitude] : null}
                onLocateMe={geo.requestLocation}
                locating={geo.loading}
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Araç Sahibi</h2>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-sm">
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-500">
                {car.owner.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{car.owner.name}</p>
                <p className="text-sm text-gray-500">
                  Üyelik: {new Date(car.owner.createdAt).toLocaleDateString("tr-TR")}
                </p>
              </div>
            </div>
          </div>

          {car.reviews.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Değerlendirmeler ({car.reviews.length})
              </h2>
              <div className="space-y-4">
                {car.reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-gray-50 rounded-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-500">
                        {review.reviewer.name.charAt(0)}
                      </div>
                      <span className="font-medium text-sm text-gray-900">{review.reviewer.name}</span>
                      <span className="text-yellow-500 text-sm ml-auto">
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-100 rounded-sm p-6 shadow-sm">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-gray-900">
                {car.pricePerDay.toLocaleString("tr-TR")} TL
              </p>
              <p className="text-sm text-gray-500">/gün</p>
            </div>

            {bookingSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Rezervasyonunuz alındı!</h3>
                <p className="text-sm text-gray-600 mt-1">Rezervasyon detaylarını panelinizde görebilirsiniz.</p>
                <Button className="mt-4" onClick={() => router.push(`/${locale}/dashboard`)}>
                  Paneli\'me Git
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alış Tarihi</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-sm border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dönüş Tarihi</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-sm border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    required
                    min={startDate || new Date().toISOString().split("T")[0]}
                  />
                </div>

                {days > 0 && (
                  <div className="bg-gray-50 rounded-sm p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{car.pricePerDay.toLocaleString("tr-TR")} TL x {days} gün</span>
                      <span className="text-gray-900">{totalPrice.toLocaleString("tr-TR")} TL</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Depozito</span>
                      <span className="text-gray-900">{car.deposit.toLocaleString("tr-TR")} TL</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between font-semibold">
                      <span>Toplam</span>
                      <span>{(totalPrice + car.deposit).toLocaleString("tr-TR")} TL</span>
                    </div>
                  </div>
                )}

                {bookingError && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-sm px-4 py-3">{bookingError}</p>
                )}

                <Button type="submit" className="w-full" size="lg" loading={bookingLoading}>
                  Şimdi Kirala
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
