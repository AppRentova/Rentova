import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth";
import { mapReview } from "@/lib/supabase/mappers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const carId = searchParams.get("carId");
    if (!carId) {
      return NextResponse.json({ error: "carId gerekli" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("id, rating, comment, reviewer:users(name)")
      .eq("car_id", carId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Reviews fetch error:", error);
      return NextResponse.json({ error: "Yorumlar yüklenemedi" }, { status: 500 });
    }

    return NextResponse.json((data || []).map(mapReview));
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json({ error: "Yorumlar yüklenemedi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, rating, comment } = body;
    if (!bookingId || !rating) {
      return NextResponse.json({ error: "Rezervasyon ve puan gerekli" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: booking, error: bError } = await supabase
      .from("bookings")
      .select("id, car_id, renter_id, status")
      .eq("id", bookingId)
      .single();

    if (bError || !booking) {
      return NextResponse.json({ error: "Rezervasyon bulunamadı" }, { status: 404 });
    }
    if (booking.renter_id !== session.userId) {
      return NextResponse.json({ error: "Bu yorumu yazamazsınız" }, { status: 403 });
    }
    if (booking.status !== "COMPLETED") {
      return NextResponse.json({ error: "Yalnızca tamamlanan kiralamalara yorum yazılabilir" }, { status: 400 });
    }

    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        booking_id: bookingId,
        reviewer_id: session.userId,
        car_id: booking.car_id,
        rating: Number(rating),
        comment: comment || "",
      })
      .select("id, rating, comment, reviewer:users(name)")
      .single();

    if (error) {
      console.error("Review create error:", error);
      return NextResponse.json({ error: "Yorum eklenemedi" }, { status: 500 });
    }

    return NextResponse.json(mapReview(review), { status: 201 });
  } catch (error) {
    console.error("Review create error:", error);
    return NextResponse.json({ error: "Yorum eklenemedi" }, { status: 500 });
  }
}
