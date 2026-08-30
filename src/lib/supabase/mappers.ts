export const CAR_SELECT = `
  id, brand, model, year, transmission,
  fuelType:fuel_type, seats,
  pricePerHour:price_per_hour, pricePerDay:price_per_day, deposit,
  description, lat, lng, address, city, isActive:is_active,
  images:car_images(id, url, is_primary),
  owner:users(name)
`;

type AnyRow = Record<string, any>;

export function mapCar(r: AnyRow) {
  return {
    id: r.id,
    brand: r.brand,
    model: r.model,
    year: r.year,
    transmission: r.transmission,
    fuelType: r.fuelType ?? r.fuel_type,
    seats: r.seats,
    pricePerHour: r.pricePerHour ?? r.price_per_hour,
    pricePerDay: r.pricePerDay ?? r.price_per_day,
    deposit: r.deposit,
    description: r.description,
    lat: r.lat,
    lng: r.lng,
    address: r.address,
    city: r.city,
    isActive: r.isActive ?? r.is_active,
    images: Array.isArray(r.images)
      ? r.images.map((i: AnyRow) => ({
          id: i.id,
          url: i.url,
          isPrimary: i.isPrimary ?? i.is_primary,
        }))
      : [],
    owner: r.owner
      ? { name: r.owner.name }
      : r.users
        ? { name: r.users.name }
        : { name: "" },
    rating: r.rating,
    reviewsCount: r.reviewsCount,
    reviews: r.reviews,
  };
}

export function mapBooking(r: AnyRow) {
  return {
    id: r.id,
    carId: r.carId ?? r.car_id,
    startDate: r.startDate ?? r.start_date,
    endDate: r.endDate ?? r.end_date,
    totalPrice: r.totalPrice ?? r.total_price,
    status: r.status,
    car: r.car
      ? {
          id: r.car.id,
          brand: r.car.brand,
          model: r.car.model,
          year: r.car.year,
          images: Array.isArray(r.car.images)
            ? r.car.images.map((i: AnyRow) => ({
                id: i.id,
                url: i.url,
                isPrimary: i.isPrimary ?? i.is_primary,
              }))
            : [],
        }
      : undefined,
  };
}

export function mapReview(r: AnyRow) {
  return {
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    reviewer: r.reviewer
      ? { name: r.reviewer.name }
      : r.users
        ? { name: r.users.name }
        : undefined,
  };
}
