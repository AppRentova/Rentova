import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth";
import { mapBooking } from "@/lib/supabase/mappers";

const ACTIVE_BOOKING_STATUSES = ["PENDING", "CONFIRMED", "ACTIVE"];
const VALID_STATUSES = ["PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"];

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `id, carId:car_id, startDate:start_date, endDate:end_date, totalPrice:total_price, status,
         car:cars(id, brand, model, year, images:car_images(id, url, is_primary))`,
      )
      .eq("renter_id", session.userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Bookings fetch error:", error);
      return NextResponse.json({ error: "Rezervasyonlar yüklenemedi" }, { status: 500 });
    }

    return NextResponse.json((data || []).map(mapBooking));
  } catch (error) {
    console.error("Bookings fetch error:", error);
    return NextResponse.json({ error: "Rezervasyonlar yüklenemedi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
    }

    const body = await request.json();
    const { carId, startDate, endDate } = body;
    if (!carId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Araç, başlangıç tarihi ve bitiş tarihi gerekli" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { data: car, error: carError } = await supabase
      .from("cars")
      .select("id, price_per_day, owner_id")
      .eq("id", carId)
      .single();

    if (carError || !car) {
      return NextResponse.json({ error: "Araç bulunamadı" }, { status: 404 });
    }
    if (car.owner_id === session.userId) {
      return NextResponse.json({ error: "Kendi aracınızı kiralayamazsınız" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return NextResponse.json({ error: "Geçerli tarihler girin" }, { status: 400 });
    }
    if (end <= start) {
      return NextResponse.json({ error: "Bitiş tarihi başlangıçtan sonra olmalı" }, { status: 400 });
    }
    if (start < new Date()) {
      return NextResponse.json({ error: "Geçmiş tarih için rezervasyon yapılamaz" }, { status: 400 });
    }

    const { data: overlap } = await supabase
      .from("bookings")
      .select("id")
      .eq("car_id", carId)
      .in("status", ACTIVE_BOOKING_STATUSES)
      .lt("start_date", endDate)
      .gt("end_date", startDate)
      .maybeSingle();

    if (overlap) {
      return NextResponse.json({ error: "Bu tarihlerde araç müsait değil" }, { status: 409 });
    }

    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.price_per_day;

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        car_id: carId,
        renter_id: session.userId,
        start_date: start.toISOString(),
        end_date: end.toISOString(),
        total_price: totalPrice,
        status: "CONFIRMED",
      })
      .select(
        `id, carId:car_id, startDate:start_date, endDate:end_date, totalPrice:total_price, status,
         car:cars(id, brand, model, year, images:car_images(id, url, is_primary))`,
      )
      .single();

    if (error) {
      console.error("Booking create error:", error);
      return NextResponse.json({ error: "Rezervasyon oluşturulamadı" }, { status: 500 });
    }

    return NextResponse.json(mapBooking(booking), { status: 201 });
  } catch (error) {
    console.error("Booking create error:", error);
    return NextResponse.json({ error: "Rezervasyon oluşturulamadı" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Rezervasyon ID gerekli" }, { status: 400 });
    }

    const { status: newStatus } = await request.json();
    if (!newStatus) {
      return NextResponse.json({ error: "Güncellenecek durum gerekli" }, { status: 400 });
    }
    if (!VALID_STATUSES.includes(newStatus)) {
      return NextResponse.json({ error: "Geçersiz rezervasyon durumu" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("renter_id, car:cars(owner_id)")
      .eq("id", id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: "Rezervasyon bulunamadı" }, { status: 404 });
    }

    const isRenter = booking.renter_id === session.userId;
    const isOwner = (booking.car as any)?.owner_id === session.userId;

    if (!isRenter && !isOwner && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }
    if (session.role !== "ADMIN" && isOwner && !["CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"].includes(newStatus)) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }
    if (session.role !== "ADMIN" && isRenter && newStatus !== "CANCELLED") {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const { data: updated, error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id)
      .select(
        `id, carId:car_id, startDate:start_date, endDate:end_date, totalPrice:total_price, status,
         car:cars(id, brand, model, year)`,
      )
      .single();

    if (error) {
      console.error("Booking update error:", error);
      return NextResponse.json({ error: "Rezervasyon güncellenemedi" }, { status: 500 });
    }

    return NextResponse.json(mapBooking(updated));
  } catch (error) {
    console.error("Booking update error:", error);
    return NextResponse.json({ error: "Rezervasyon güncellenemedi" }, { status: 500 });
  }
}
