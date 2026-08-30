import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CAR_SELECT, mapCar, mapReview } from "@/lib/supabase/mappers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: car, error } = await supabase
      .from("cars")
      .select(CAR_SELECT)
      .eq("id", id)
      .maybeSingle();

    if (error || !car) {
      return NextResponse.json({ error: "Araç bulunamadı" }, { status: 404 });
    }

    const { data: reviews } = await supabase
      .from("reviews")
      .select("id, rating, comment, reviewer:users(name)")
      .eq("car_id", id)
      .order("created_at", { ascending: false });

    const mapped = mapCar(car);
    const reviewList = (reviews || []).map(mapReview);
    mapped.reviewsCount = reviewList.length;
    mapped.rating = reviewList.length
      ? reviewList.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewList.length
      : undefined;
    mapped.reviews = reviewList;

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Car fetch error:", error);
    return NextResponse.json({ error: "Araç yüklenemedi" }, { status: 500 });
  }
}
