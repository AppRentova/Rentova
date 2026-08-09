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
      className={`group flex overflow-hidden border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-lg dark:border-white/10 dark:bg-[#151522] dark:hover:border-white/25 ${
        compact ? "min-h-40 flex-row rounded-none" : "flex-col rounded-sm"
      }`}
    >
      <div className={`relative shrink-0 overflow-hidden bg-gray-100 dark:bg-white/10 ${compact ? "w-[42%]" : "aspect-[16/10] w-full"}`}>
        <img
          src={primaryImage}
          alt={`${car.brand} ${car.model}`}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
        {hasConnect && (
          <span className="absolute left-2 top-2 bg-white px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#1d1138] shadow-sm dark:bg-[#101018] dark:text-white">
            Rentova Connect
          </span>
        )}
      </div>

      <div className={`flex min-w-0 flex-1 flex-col justify-between ${compact ? "p-3" : "p-4"}`}>
        <div>
          <h3 className={`truncate font-bold text-[#1d1138] dark:text-white ${compact ? "text-base" : "text-lg"}`}>
            {car.brand} {car.model} ({car.year})
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
            <span className="text-[var(--primary-purple)]">★ {rating.toFixed(2)}</span>
            <span>({reviewsCount})</span>
            <span>•</span>
            <span>{distance}</span>
          </div>
        </div>

        <div className="mt-3 border-t border-gray-100 pt-3 dark:border-white/10">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            <span className="mr-1.5 line-through">{originalPrice.toLocaleString("tr-TR")} TL</span>
            <span className={`font-bold text-[#1d1138] dark:text-white ${compact ? "text-sm" : "text-base"}`}>
              {car.pricePerDay.toLocaleString("tr-TR")} TL
            </span>
            <span> / gun</span>
            {!compact && (
              <>
                <span className="mx-1">•</span>
                <span>{totalPrice.toLocaleString("tr-TR")} TL total</span>
              </>
            )}
          </div>

          <div className="mt-2.5 flex w-fit items-center gap-1 bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700 dark:bg-green-500/10 dark:text-green-300">
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
