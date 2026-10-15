export type Vehicle = { id: string; name: string; district: string; city: string; image: string; dailyPrice: number; hourlyPrice: number; rating: number; distance: string; transmission: "Automatic" | "Manual"; fuel: "Petrol" | "Hybrid" | "Electric"; seats: number; instantBook: boolean };
export const vehicles: Vehicle[] = [
  { id: "renault-clio-kadikoy", name: "Renault Clio", district: "Kadıköy", city: "Istanbul", image: "/vehicles/car-one.png", dailyPrice: 1250, hourlyPrice: 145, rating: 4.9, distance: "350 m", transmission: "Automatic", fuel: "Petrol", seats: 5, instantBook: true },
  { id: "toyota-corolla-besiktas", name: "Toyota Corolla Cross", district: "Beşiktaş", city: "Istanbul", image: "/vehicles/car-two.png", dailyPrice: 1480, hourlyPrice: 175, rating: 4.8, distance: "620 m", transmission: "Automatic", fuel: "Hybrid", seats: 5, instantBook: true },
  { id: "bmw-3-cankaya", name: "BMW 3 Series", district: "Çankaya", city: "Ankara", image: "/vehicles/car-three.png", dailyPrice: 2100, hourlyPrice: 240, rating: 4.9, distance: "780 m", transmission: "Automatic", fuel: "Petrol", seats: 5, instantBook: false },
];
export function getVehicle(id: string) { return vehicles.find((vehicle) => vehicle.id === id); }
