import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const carId = searchParams.get("carId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!carId) {
      return NextResponse.json({ error: "Araç ID gerekli" }, { status: 400 });
    }

    const supabase = await createClient();

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const { data: overlapping } = await supabase
        .from("bookings")
        .select("id")
        .eq("car_id", carId)
        .in("status", ["PENDING", "CONFIRMED", "ACTIVE"])
        .lt("start_date", endDate)
        .gt("end_date", startDate)
        .maybeSingle();

      if (overlapping) {
        return NextResponse.json({ available: false, message: "Bu tarihlerde araç müsait değil" });
      }
      return NextResponse.json({ available: true });
    }

    const { data: availabilities } = await supabase
      .from("car_availability")
      .select("id, car_id, date, is_available")
      .eq("car_id", carId)
      .order("date", { ascending: true });

    const { data: booked } = await supabase
      .from("bookings")
      .select("start_date, end_date")
      .eq("car_id", carId)
      .in("status", ["PENDING", "CONFIRMED", "ACTIVE"])
      .gte("end_date", new Date().toISOString())
      .order("start_date", { ascending: true });

    return NextResponse.json({
      availabilities: availabilities || [],
      bookedRanges: (booked || []).map((b) => ({
        startDate: b.start_date,
        endDate: b.end_date,
      })),
    });
  } catch (error) {
    console.error("Availability fetch error:", error);
    return NextResponse.json(
      { error: "Müsaitlik bilgisi yüklenirken bir hata oluştu" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
    }

    const body = await request.json();
    const { carId, date, isAvailable } = body;
    if (!carId || !date) {
      return NextResponse.json({ error: "Araç ID ve tarih gerekli" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: car, error: carError } = await supabase
      .from("cars")
      .select("owner_id")
      .eq("id", carId)
      .single();

    if (carError || !car) {
      return NextResponse.json({ error: "Araç bulunamadı" }, { status: 404 });
    }
    if (car.owner_id !== session.userId && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("car_availability")
      .upsert(
        { car_id: carId, date: new Date(date).toISOString().slice(0, 10), is_available: isAvailable ?? true },
        { onConflict: "car_id,date" },
      )
      .select()
      .single();

    if (error) {
      console.error("Availability create error:", error);
      return NextResponse.json(
        { error: "Müsaitlik bilgisi eklenirken bir hata oluştu" },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Availability create error:", error);
    return NextResponse.json(
      { error: "Müsaitlik bilgisi eklenirken bir hata oluştu" },
      { status: 500 },
    );
  }
}
