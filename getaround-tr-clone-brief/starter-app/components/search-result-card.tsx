"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import type { Vehicle } from "../lib/vehicles";
import { formatCurrency } from "../lib/i18n";

export function SearchResultCard({ vehicle, active, priority, onActive }: { vehicle: Vehicle; active: boolean; priority: boolean; onActive: (id: string) => void }) {
  return <Link className={`search-result-card${active ? " is-active" : ""}`} href={`/cars/${vehicle.id}`} onMouseEnter={() => onActive(vehicle.id)} onFocus={() => onActive(vehicle.id)}>
    <Image src={vehicle.image} alt={`${vehicle.name} in ${vehicle.district}`} width={220} height={150} sizes="(max-width: 760px) 42vw, 170px" priority={priority} quality={72} />
    <div className="search-result-copy">
      <div><h2>{vehicle.name}</h2><span><Star aria-hidden="true" /> {vehicle.rating}</span></div>
      <p>{vehicle.transmission} · {vehicle.fuel}</p>
      <small><MapPin aria-hidden="true" /> {vehicle.distance} from search</small>
      <strong>From {formatCurrency(vehicle.hourlyPrice)} / hour <span>· {formatCurrency(vehicle.dailyPrice)} / day</span></strong>
    </div>
  </Link>;
}
