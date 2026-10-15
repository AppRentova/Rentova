import { Star } from "lucide-react";

type Vehicle = {
  name: string;
  district: string;
  price: string;
  rating: string;
};

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <article className="grid grid-cols-[112px_1fr] gap-4 rounded-lg border border-slate-200 p-3">
      <div className="aspect-[4/3] rounded-md bg-gradient-to-br from-slate-200 to-slate-100" />
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-950">{vehicle.name}</h2>
            <p className="text-sm text-slate-500">{vehicle.district}</p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm text-slate-700">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {vehicle.rating}
          </span>
        </div>
        <p className="mt-5 font-semibold text-teal-800">{vehicle.price}</p>
      </div>
    </article>
  );
}

