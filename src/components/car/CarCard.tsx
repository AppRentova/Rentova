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
}

export function CarCard({ car, t, locale }: CarCardProps) {
  const primaryImage = car.images.find((img) => img.isPrimary)?.url || car.images[0]?.url || "";
  const rating = car.rating || 4.65;
  const reviewsCount = car.reviewsCount || 42;
  const distance = car.distance || "1.2 km";
  const hasConnect = car.hasConnect !== false; // Default to true to show Connect styling

  const originalPrice = Math.round(car.pricePerDay * 1.15);
  const totalPrice = Math.round(car.pricePerDay * 3); // Simulated 3 days

  return (
    <Link
      href={`/${locale}/cars/${car.id}`}
      className="group flex flex-col bg-white rounded-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
    >
      <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        )}
        
        {hasConnect && (
          <span className="absolute top-3 left-3 bg-white text-[#1d1138] text-[10px] font-extrabold px-2.5 py-1 rounded-sm uppercase tracking-wider shadow-sm">
            Rentova Connect
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-[#1d1138] text-lg">
            {car.brand} {car.model} ({car.year})
          </h3>
          
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mt-1">
            <span className="flex items-center text-purple-700">
              ★ {rating.toFixed(2)}
            </span>
            <span>({reviewsCount})</span>
            <span>•</span>
            <span>{distance}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-50">
          <div className="flex items-baseline justify-between">
            <div className="text-gray-500 text-xs font-semibold">
              <span className="line-through mr-1.5">€{originalPrice}</span>
              <span className="text-[#1d1138] text-base font-bold">€{car.pricePerDay}</span>
              <span> per day</span>
              <span className="mx-1">•</span>
              <span>€{totalPrice} total</span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-sm w-fit">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>Free cancellation</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

