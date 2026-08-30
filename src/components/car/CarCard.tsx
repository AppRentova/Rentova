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

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=82",
];

function fallbackImageFor(id: string) {
  const index = id.split("").reduce((total, char) => total + char.charCodeAt(0), 0) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[index];
}

export function CarCard({ car, locale, compact = false }: CarCardProps) {
  const primaryImage =
    car.images.find((img) => img.isPrimary)?.url || car.images[0]?.url || fallbackImageFor(car.id);
  const rating = car.rating || 4.65;
  const reviewsCount = car.reviewsCount || 42;
  const distance = car.distance || "1.2 km";
  const hasConnect = car.hasConnect !== false;
  const totalPrice = Math.round(car.pricePerDay * 3);

  return (
    <Link
      href={`/${locale}/cars/${car.id}`}
      className={`group flex overflow-hidden border border-[#130f1f]/10 bg-white text-[#130f1f] transition hover:-translate-y-0.5 hover:border-[#130f1f]/30 hover:shadow-[10px_10px_0_rgba(19,15,31,0.10)] dark:border-white/10 dark:bg-[#12121a] dark:text-white dark:hover:border-white/25 ${
        compact ? "min-h-[148px] flex-row" : "flex-col"
      }`}
    >
      <div className={`relative shrink-0 overflow-hidden bg-[#ebe8df] dark:bg-white/10 ${compact ? "w-[44%]" : "aspect-[16/10] w-full"}`}>
        <img
          src={primaryImage}
          alt={`${car.brand} ${car.model}`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImageFor(car.id);
          }}
        />
        {hasConnect && (
          <span className="absolute left-2 top-2 border border-black/10 bg-white px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-[#130f1f] shadow-sm">
            Rentova Connect
          </span>
        )}
      </div>

      <div className={`flex min-w-0 flex-1 flex-col justify-between ${compact ? "p-3" : "p-4"}`}>
        <div>
          <h3 className={`truncate font-black tracking-tight ${compact ? "text-base" : "text-xl"}`}>
            {car.brand} {car.model} ({car.year})
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[#6d6878] dark:text-white/55">
            <span className="text-[#653496]">★ {rating.toFixed(2)}</span>
            <span>({reviewsCount})</span>
            <span>|</span>
            <span>{distance}</span>
          </div>
        </div>

        <div className="mt-3 border-t border-[#130f1f]/10 pt-3 dark:border-white/10">
          <div className="flex items-end justify-between gap-3">
            <div className="text-xs font-semibold text-[#6d6878] dark:text-white/55">
              <span className={`font-black text-[#130f1f] dark:text-white ${compact ? "text-base" : "text-xl"}`}>
                {car.pricePerDay.toLocaleString("tr-TR")} TL
              </span>
              <span> / gun</span>
              {!compact && <span className="block mt-1">{totalPrice.toLocaleString("tr-TR")} TL toplam</span>}
            </div>
            <span className="hidden border border-[#130f1f]/15 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition group-hover:bg-[#130f1f] group-hover:text-white dark:border-white/15 dark:group-hover:bg-white dark:group-hover:text-[#130f1f] sm:inline-flex">
              Incele
            </span>
          </div>

          <div className="mt-2 flex w-fit items-center gap-1 bg-[#e8f6df] px-2.5 py-1 text-[11px] font-bold text-[#216b1f] dark:bg-[#11351f] dark:text-[#a8e6a3]">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>Ucretsiz iptal</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
