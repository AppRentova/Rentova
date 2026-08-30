import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth";
import { carSchema } from "@/lib/validations";
import { CAR_SELECT, mapCar } from "@/lib/supabase/mappers";

type SearchableCar = ReturnType<typeof mapCar> & {
  distance?: string;
  distanceKm?: number;
};

function normalizeSearch(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const radius = 6371;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const startLat = toRad(aLat);
  const endLat = toRad(bLat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(dLng / 2) ** 2;

  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || searchParams.get("q");
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const transmission = searchParams.get("transmission");
    const seats = searchParams.get("seats");
    const fuelType = searchParams.get("fuelType");
    const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lng);

    const supabase = await createClient();
    let query = supabase.from("cars").select(CAR_SELECT).eq("is_active", true);

    if (minPrice) query = query.gte("price_per_day", parseFloat(minPrice));
    if (maxPrice) query = query.lte("price_per_day", parseFloat(maxPrice));
    if (transmission) query = query.eq("transmission", transmission);
    if (seats) query = query.gte("seats", parseInt(seats));
    if (fuelType) {
      const types = fuelType.split(",").filter(Boolean);
      if (types.length > 0) query = query.in("fuel_type", types);
    }

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(city ? 200 : 80);

    if (error) {
      console.error("Cars fetch error:", error);
      return NextResponse.json({ error: "Araclar yuklenemedi" }, { status: 500 });
    }

    const cityQuery = city ? normalizeSearch(city) : "";
    const cars = ((data || []).map(mapCar) as SearchableCar[])
      .filter((car) => {
        if (!cityQuery || cityQuery === "konumum" || cityQuery === "gps konumun") return true;
        const haystack = normalizeSearch(`${car.city || ""} ${car.address || ""}`);
        return haystack.includes(cityQuery);
      })
      .map((car) => {
        if (!hasCoordinates || typeof car.lat !== "number" || typeof car.lng !== "number") return car;
        const km = distanceKm(lat, lng, car.lat, car.lng);

        return {
          ...car,
          distance: km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`,
          distanceKm: km,
        };
      })
      .sort((a, b) => {
        if (!hasCoordinates) return 0;
        return (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY);
      })
      .slice(0, 50);

    return NextResponse.json(cars);
  } catch (error) {
    console.error("Cars fetch error:", error);
    return NextResponse.json({ error: "Araclar yuklenemedi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Giris yapmalisiniz" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = carSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Gecersiz veri" },
        { status: 400 },
      );
    }
    const d = parsed.data;

    const supabase = await createClient();
    const { data: car, error } = await supabase
      .from("cars")
      .insert({
        owner_id: session.userId,
        brand: d.brand,
        model: d.model,
        year: d.year,
        transmission: d.transmission,
        fuel_type: d.fuelType,
        seats: d.seats,
        price_per_hour: d.pricePerHour,
        price_per_day: d.pricePerDay,
        deposit: d.deposit,
        description: d.description,
        lat: d.lat,
        lng: d.lng,
        address: d.address,
        city: d.city,
        is_active: true,
      })
      .select("id")
      .single();

    if (error || !car) {
      console.error("Car create error:", error);
      return NextResponse.json({ error: "Arac eklenemedi" }, { status: 500 });
    }

    const images = (d.images || []).filter(Boolean);
    if (images.length > 0) {
      const { error: imgError } = await supabase.from("car_images").insert(
        images.map((url: string, idx: number) => ({
          car_id: car.id,
          url,
          is_primary: idx === 0,
        })),
      );
      if (imgError) console.error("Car images insert error:", imgError);
    }

    return NextResponse.json({ id: car.id }, { status: 201 });
  } catch (error) {
    console.error("Car create error:", error);
    return NextResponse.json({ error: "Arac eklenemedi" }, { status: 500 });
  }
}
