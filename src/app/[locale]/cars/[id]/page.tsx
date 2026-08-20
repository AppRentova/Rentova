"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { DateTimePicker, Button } from "@/components/ui";
import { CarCard } from "@/components/car/CarCard";
import { useGeolocation } from "@/hooks/useGeolocation";

const MapView = dynamic(() => import("@/components/map/MapView").then((m) => m.MapView), {
  ssr: false,
});

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

interface ListedCar {
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
  images: { url: string; isPrimary: boolean }[];
  owner: { name: string };
  rating?: number;
  reviewsCount?: number;
  distance?: string;
  hasConnect?: boolean;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80";

function createBookingDate(offsetDays: number) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setHours(9, 0, 0, 0);
  return date;
}

function Icon({ name }: { name: "check" | "pin" | "seat" | "gear" | "fuel" | "calendar" | "bolt" | "clock" }) {
  const paths = {
    check: "M5 13l4 4L19 7",
    pin: "M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11zm0-8a3 3 0 100-6 3 3 0 000 6z",
    seat: "M7 11V6a3 3 0 116 0v5m-8 0h10l2 9H5l2-9zm2 4h6",
    gear: "M4 7h16M7 7v10m10-10v10M4 17h16",
    fuel: "M6 3h8v18H6V3zm8 4h2l2 2v8a2 2 0 104 0V9l-4-4",
    calendar: "M7 3v4m10-4v4M4 9h16M5 5h14v16H5V5z",
    bolt: "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
    clock: "M12 8v5l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  };

  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={paths[name]} />
    </svg>
  );
}

export default function CarDetailPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const router = useRouter();
  const [car, setCar] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState("tr");
  const [startDate, setStartDate] = useState(() => createBookingDate(1));
  const [endDate, setEndDate] = useState(() => createBookingDate(3));
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [mainImage, setMainImage] = useState(0);
  const [nearbyCars, setNearbyCars] = useState<ListedCar[]>([]);
  const geo = useGeolocation();

  useEffect(() => {
    geo.requestLocation();
  }, [geo.requestLocation]);

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

  useEffect(() => {
    if (!car?.city) return;

    const city = car.city;
    const carId = car.id;

    async function loadNearbyCars() {
      try {
        const res = await fetch(`/api/cars?city=${encodeURIComponent(city)}`);
        if (!res.ok) return;

        const data = (await res.json()) as ListedCar[];
        setNearbyCars(data.filter((item) => item.id !== carId).slice(0, 4));
      } catch (err) {
        console.error("Failed to load nearby cars", err);
      }
    }

    loadNearbyCars();
  }, [car?.city, car?.id]);

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!car) return;
    setBookingLoading(true);
    setBookingError("");
    setBookingSuccess(false);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId: car.id, startDate: startDate.toISOString(), endDate: endDate.toISOString() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setBookingError(data.error || "Rezervasyon basarisiz");
        return;
      }

      setBookingSuccess(true);
    } catch {
      setBookingError("Bir hata olustu");
    } finally {
      setBookingLoading(false);
    }
  }

  const days =
    startDate && endDate ? Math.max(0, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))) : 0;

  const totalPrice = car && days > 0 ? days * car.pricePerDay : 0;
  const gallery = useMemo(() => {
    const images = car?.images?.map((image) => image.url).filter(Boolean) || [];
    return images.length > 0 ? images : [FALLBACK_IMAGE];
  }, [car]);
  const averageRating = car?.reviews.length
    ? car.reviews.reduce((total, review) => total + review.rating, 0) / car.reviews.length
    : 4.32;
  const reviewCount = car?.reviews.length || 22;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-4">
          <div className="h-96 animate-pulse bg-gray-200 dark:bg-white/10" />
          <div className="h-8 w-1/3 animate-pulse bg-gray-200 dark:bg-white/10" />
          <div className="h-4 w-1/2 animate-pulse bg-gray-200 dark:bg-white/10" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#1d1138] dark:text-white">Arac bulunamadi</h2>
        <Button className="mt-4" onClick={() => router.back()}>
          Geri Don
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white py-8 text-[#1d1138] dark:bg-[#0c0c12] dark:text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-10 lg:col-span-2">
          <section className="overflow-hidden border border-gray-200 bg-white dark:border-white/10 dark:bg-[#151522]">
            <div className="grid gap-2 p-4 md:grid-cols-[2fr_1fr]">
              <button type="button" onClick={() => setMainImage(0)} className="aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-white/10">
                <img src={gallery[mainImage] || FALLBACK_IMAGE} alt={`${car.brand} ${car.model}`} className="h-full w-full object-cover" />
              </button>
              <div className="hidden grid-rows-2 gap-2 md:grid">
                {[gallery[1] || gallery[0], gallery[2] || gallery[0]].map((image, index) => (
                  <button key={index} type="button" onClick={() => setMainImage(Math.min(index + 1, gallery.length - 1))} className="overflow-hidden bg-gray-100 dark:bg-white/10">
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 px-5 py-6 dark:border-white/10">
              <h1 className="text-3xl font-extrabold">
                {car.brand} {car.model}
              </h1>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="inline-flex items-center gap-1.5"><Icon name="pin" /> {car.city}</span>
                <span>{car.year}</span>
                <span>{car.seats} seats</span>
              </div>
            </div>

            <div className="grid grid-cols-2 border-t border-gray-200 dark:border-white/10">
              <div className="border-r border-gray-200 p-5 text-center dark:border-white/10">
                <p className="text-3xl font-black">{averageRating.toFixed(2)}</p>
                <p className="text-[var(--primary-purple)]">★★★★<span className="text-gray-300">★</span></p>
              </div>
              <div className="p-5 text-center">
                <p className="text-3xl font-black">{reviewCount}</p>
                <p className="text-sm underline">Reviews</p>
              </div>
            </div>
          </section>

          <section className="border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-[#151522]">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-[var(--primary-purple)] text-white">
                <Icon name="bolt" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold">Unlock this car with your phone</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">No need to meet anyone. Open the car with the app, the keys are inside.</p>
                <button className="mt-3 text-sm font-bold text-[var(--primary-purple)]">See how it works</button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-extrabold">Pickup & return location</h2>
            <div className="grid gap-4 border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-[#151522] md:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-gray-100 text-[#1d1138] dark:bg-white/10 dark:text-white">
                  <Icon name="pin" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Near</p>
                  <p className="font-bold">{car.address || `${car.city}, Turkiye`}</p>
                  <p className="mt-4 bg-gray-100 p-4 text-sm text-gray-700 dark:bg-white/10 dark:text-gray-300">
                    The exact location is shared after booking.
                  </p>
                </div>
              </div>
              <div className="h-56 overflow-hidden border border-gray-200 dark:border-white/10">
                <MapView
                  cars={[{ id: car.id, lat: car.lat, lng: car.lng, brand: car.brand, model: car.model, price: car.pricePerDay }]}
                  center={[car.lat, car.lng]}
                  zoom={15}
                  userLocation={geo.latitude !== null && geo.longitude !== null ? [geo.latitude, geo.longitude] : null}
                  onLocateMe={geo.requestLocation}
                  locating={geo.loading}
                />
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div>
              <h2 className="mb-4 text-2xl font-extrabold">Car description</h2>
              <div className="border border-gray-200 bg-white p-5 leading-7 text-gray-700 dark:border-white/10 dark:bg-[#151522] dark:text-gray-300">
                {car.description || "This car is ready for city trips, daily errands and weekend plans."}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-extrabold">Owner rules</h2>
              <p className="leading-7 text-gray-700 dark:text-gray-300">Smoking and pets are not allowed in the car.</p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-extrabold">Technical features</h2>
              <div className="grid gap-4 text-gray-700 dark:text-gray-300 sm:grid-cols-2">
                <p className="flex items-center gap-3"><Icon name="gear" /> {car.transmission === "AUTOMATIC" ? "Automatic" : "Manual"}</p>
                <p className="flex items-center gap-3"><Icon name="fuel" /> {car.fuelType}</p>
                <p className="flex items-center gap-3"><Icon name="seat" /> {car.seats} seats with seatbelt</p>
                <p className="flex items-center gap-3"><Icon name="calendar" /> Year {car.year}</p>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-extrabold">Equipment and options</h2>
              <div className="grid gap-4 text-gray-700 dark:text-gray-300 sm:grid-cols-2">
                {["Cruise control", "Bluetooth audio", "Air conditioning", "Apple CarPlay", "Android Auto", "Snow tires"].map((item) => (
                  <p key={item} className="flex items-center gap-3"><Icon name="check" /> {item}</p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-extrabold">Reviews</h2>
              <div className="border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#151522]">
                <div className="grid gap-6 md:grid-cols-[160px_1fr]">
                  <div className="text-center">
                    <p className="text-5xl font-black">{averageRating.toFixed(2)}</p>
                    <p className="mt-1 text-[var(--primary-purple)]">★★★★<span className="text-gray-300">★</span></p>
                    <p className="mt-1 text-sm text-gray-500">{reviewCount}</p>
                  </div>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="grid grid-cols-[20px_1fr] items-center gap-3 text-sm">
                        <span>{rating}</span>
                        <div className="h-2 bg-gray-100 dark:bg-white/10">
                          <div className="h-full bg-[var(--primary-purple)]" style={{ width: rating === 5 ? "100%" : rating === 4 ? "18%" : rating === 1 ? "16%" : "0%" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-extrabold">Perks of renting with Rentova</h2>
            <div className="space-y-5">
              {[
                ["clock", "24/7 pick-up and drop-off", "Pick up and return your car on your own."],
                ["calendar", "Extend your rental easily", "Adjust start and return times in just a few clicks."],
                ["bolt", "30-minute margin for late returns", "Avoid stress when plans change."],
              ].map(([icon, title, desc]) => (
                <div key={title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-gray-100 dark:bg-white/10">
                    <Icon name={icon as "clock" | "calendar" | "bolt"} />
                  </div>
                  <div>
                    <p className="font-bold">{title}</p>
                    <p className="text-gray-600 dark:text-gray-300">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-extrabold">Availability</h2>
            <div className="grid gap-6 border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-[#151522] md:grid-cols-2">
              {["July 2026", "August 2026"].map((month) => (
                <div key={month}>
                  <h3 className="mb-4 text-center font-extrabold">{month}</h3>
                  <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                      <span key={day} className="text-gray-500">{day}</span>
                    ))}
                    {Array.from({ length: 35 }).map((_, index) => (
                      <span key={index} className={index % 9 === 0 ? "text-gray-300" : "text-[#1d1138] dark:text-white"}>
                        {index > 10 ? index - 10 : ""}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-500 md:col-span-2">Updated: 1 day ago</p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-extrabold">Owner information</h2>
            <div className="border border-gray-200 bg-white p-5 leading-7 dark:border-white/10 dark:bg-[#151522]">
              <p className="font-bold">{car.owner.name}</p>
              <p>{car.city}</p>
              <p>Member since {new Date(car.owner.createdAt).toLocaleDateString("tr-TR")}</p>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Company registration number: 0000000</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">VAT number: TR0000000000</p>
            </div>
          </section>

          {nearbyCars.length > 0 && (
            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold">Ayni bolgedeki diger araclar</h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{car.city} icinde listelenen alternatifler</p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/search?city=${encodeURIComponent(car.city)}`)}
                  className="shrink-0 text-sm font-bold text-[var(--primary-purple)]"
                >
                  Tumunu gor
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {nearbyCars.map((listedCar) => (
                  <CarCard key={listedCar.id} car={listedCar} locale={locale} t={(key) => key} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#151522]">
              <p className="text-4xl font-black">{car.pricePerHour.toLocaleString("tr-TR")} TL</p>
              <p className="mt-1 text-gray-600 dark:text-gray-300">Average price per hour</p>

              {bookingSuccess ? (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-green-100 text-green-700">
                    <Icon name="check" />
                  </div>
                  <h3 className="text-lg font-semibold">Rezervasyonunuz alindi</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Rezervasyon detaylari panelinizde.</p>
                  <Button className="mt-4" onClick={() => router.push(`/${locale}/dashboard`)}>
                    Panele Git
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="mt-6 space-y-4">
                  <DateTimePicker
                    locale={locale}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(nextStart, nextEnd) => {
                      setStartDate(nextStart);
                      setEndDate(nextEnd);
                    }}
                  />

                  {days > 0 && (
                    <div className="space-y-2 bg-gray-50 p-4 text-sm dark:bg-white/10">
                      <div className="flex justify-between"><span>{car.pricePerDay.toLocaleString("tr-TR")} TL x {days} gun</span><span>{totalPrice.toLocaleString("tr-TR")} TL</span></div>
                      <div className="flex justify-between"><span>Depozito</span><span>{car.deposit.toLocaleString("tr-TR")} TL</span></div>
                      <div className="flex justify-between border-t border-gray-200 pt-2 font-bold dark:border-white/10"><span>Toplam</span><span>{(totalPrice + car.deposit).toLocaleString("tr-TR")} TL</span></div>
                    </div>
                  )}

                  {bookingError && <p className="bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300">{bookingError}</p>}

                  <Button type="submit" className="w-full bg-[var(--primary-purple)] hover:bg-[var(--primary-purple-hover)]" size="lg" loading={bookingLoading}>
                    Book
                  </Button>
                </form>
              )}
            </div>

            <div className="bg-green-50 p-4 text-green-800 dark:bg-green-500/10 dark:text-green-300">
              <p className="font-bold">Free cancellation</p>
              <p className="text-sm">Up to 48 hours before your rental starts</p>
            </div>

            <div className="border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#151522]">
              <h2 className="text-2xl font-extrabold">Included in the price</h2>
              <div className="mt-5 space-y-4">
                {["Comprehensive vehicle and passenger insurance included", "24/7 roadside assistance", "Free secondary drivers"].map((item) => (
                  <p key={item} className="flex items-start gap-3 text-sm font-bold">
                    <span className="text-green-600"><Icon name="check" /></span>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
