import Link from "next/link";

interface CarCardProps {
  car: {
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
  };
  t: (key: string) => string;
  locale: string;
  compact?: boolean;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80";

export function CarCard({ car, locale, compact = false }: CarCardProps) {
  const primaryImage =
    car.images.find((img) => img.isPrimary)?.url || car.images[0]?.url || FALLBACK_IMAGE;
  const rating = car.rating || 4.65;
  const reviewsCount = car.reviewsCount || 42;
  const distance = car.distance || "1.2 km";
  const hasConnect = car.hasConnect !== false;

  const originalPrice = Math.round(car.pricePerDay * 1.15);
  const totalPrice = Math.round(car.pricePerDay * 3);

  return (
    <Link
      href={`/${locale}/cars/${car.id}`}
      className={`group flex flex-col overflow-hidden border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-lg ${
        compact ? "rounded-none" : "rounded-sm"
      }`}
    >
      <div className={`relative overflow-hidden bg-gray-100 ${compact ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        <img
          src={primaryImage}
          alt={`${car.brand} ${car.model}`}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />

        {hasConnect && (
          <span className="absolute left-3 top-3 bg-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#1d1138] shadow-sm">
            Rentova Connect
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col justify-between ${compact ? "p-3.5" : "p-4"}`}>
        <div>
          <h3 className={`font-bold text-[#1d1138] ${compact ? "text-base" : "text-lg"}`}>
            {car.brand} {car.model} ({car.year})
          </h3>

          <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <span className="flex items-center text-purple-700">★ {rating.toFixed(2)}</span>
            <span>({reviewsCount})</span>
            <span>•</span>
            <span>{distance}</span>
          </div>
        </div>

        <div className={`mt-4 border-t border-gray-100 pt-3 ${compact ? "mt-3 pt-2.5" : ""}`}>
          <div className="flex items-baseline justify-between">
            <div className="text-xs font-semibold text-gray-500">
              <span className="mr-1.5 line-through">€{originalPrice}</span>
              <span className={`font-bold text-[#1d1138] ${compact ? "text-sm" : "text-base"}`}>
                €{car.pricePerDay}
              </span>
              <span> per day</span>
              <span className="mx-1">•</span>
              <span>€{totalPrice} total</span>
            </div>
          </div>

          <div
            className={`mt-2.5 flex w-fit items-center gap-1 bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700 ${
              compact ? "rounded-none" : "rounded-sm"
            }`}
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>Free cancellation</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
