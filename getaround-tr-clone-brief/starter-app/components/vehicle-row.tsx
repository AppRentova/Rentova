import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gauge, MapPin, Star, Users } from "lucide-react";
import type { Vehicle } from "../lib/vehicles";
import { formatCurrency } from "../lib/i18n";
export function VehicleRow({ vehicle, priority = false }: { vehicle: Vehicle; priority?: boolean }) { return <Link className="vehicle-row" href={`/cars/${vehicle.id}`}>
  <Image src={vehicle.image} alt={`${vehicle.name} in ${vehicle.district}`} width={360} height={180} sizes="(max-width: 760px) 34vw, 180px" priority={priority} quality={72} />
  <div className="vehicle-summary"><div><strong>{vehicle.district}</strong><span>{vehicle.name}</span></div><small><Users /> {vehicle.seats}<Gauge /> {vehicle.transmission} · {vehicle.fuel}</small></div>
  <div className="availability"><span className="status-dot" />Available now<small><MapPin />{vehicle.distance}</small></div>
  <div className="vehicle-price"><strong>{formatCurrency(vehicle.dailyPrice)}</strong><span>/ day</span></div><ArrowRight aria-hidden="true" />
</Link> }
