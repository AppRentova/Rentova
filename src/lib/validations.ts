import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("GeÃ§erli bir e-posta adresi girin"),
  password: z.string().min(6, "Åifre en az 6 karakter olmalÄ±dÄ±r"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalÄ±dÄ±r"),
  email: z.string().email("GeÃ§erli bir e-posta adresi girin"),
  phone: z.string().optional(),
  password: z.string().min(6, "Åifre en az 6 karakter olmalÄ±dÄ±r"),
});

export const carSchema = z.object({
  brand: z.string().min(1, "Marka zorunludur"),
  model: z.string().min(1, "Model zorunludur"),
  year: z.coerce.number().int().min(2000).max(2030),
  transmission: z.enum(["MANUAL", "AUTOMATIC"]),
  fuelType: z.enum(["GASOLINE", "DIESEL", "ELECTRIC", "HYBRID", "LPG"]),
  seats: z.coerce.number().int().min(1).max(9),
  pricePerHour: z.coerce.number().positive(),
  pricePerDay: z.coerce.number().positive(),
  deposit: z.coerce.number().min(0).default(0),
  description: z.string().min(10, "AÃ§Ä±klama en az 10 karakter olmalÄ±dÄ±r"),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  address: z.string().min(1, "Adres zorunludur"),
  city: z.string().min(1, "Åehir zorunludur"),
  images: z.array(z.string().url()).max(8).optional(),
});

export const bookingSchema = z.object({
  carId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CarInput = z.infer<typeof carSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
