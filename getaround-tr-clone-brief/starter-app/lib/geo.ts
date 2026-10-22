export type Coordinates = { lat: number; lng: number };

export function distanceInKilometers(from: Coordinates, to: Coordinates) {
  const earthRadius = 6371;
  const radians = (value: number) => value * Math.PI / 180;
  const latitudeDelta = radians(to.lat - from.lat);
  const longitudeDelta = radians(to.lng - from.lng);
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(longitudeDelta / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(kilometers: number) {
  return kilometers < 1 ? `${Math.round(kilometers * 1000)} m` : `${kilometers.toFixed(1)} km`;
}
