import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
      return NextResponse.json({ error: "Araç bulunamadı" }, { status: 404 });
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const overlapping = await prisma.booking.findFirst({
        where: {
          carId,
          status: { in: ["PENDING", "CONFIRMED", "ACTIVE"] },
          AND: [
            { startDate: { lt: end } },
            { endDate: { gt: start } },
          ],
        },
      });

      if (overlapping) {
        return NextResponse.json({ available: false, message: "Bu tarihlerde araç müsait değil" });
      }

      return NextResponse.json({ available: true });
    }

    const availabilities = await prisma.carAvailability.findMany({
      where: { carId },
      orderBy: { date: "asc" },
    });

    const endDates = await prisma.booking.findMany({
      where: {
        carId,
        status: { in: ["PENDING", "CONFIRMED", "ACTIVE"] },
        endDate: { gte: new Date() },
      },
      select: { startDate: true, endDate: true },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json({
      availabilities,
      bookedRanges: endDates.map((b) => ({
        startDate: b.startDate,
        endDate: b.endDate,
      })),
    });
  } catch (error) {
    console.error("Availability fetch error:", error);
    return NextResponse.json(
      { error: "Müsaitlik bilgisi yüklenirken bir hata oluştu" },
      { status: 500 }
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

    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
      return NextResponse.json({ error: "Araç bulunamadı" }, { status: 404 });
    }

    if (car.ownerId !== session.userId && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const availability = await prisma.carAvailability.upsert({
      where: {
        carId_date: { carId, date: new Date(date) },
      },
      update: { isAvailable: isAvailable ?? true },
      create: {
        carId,
        date: new Date(date),
        isAvailable: isAvailable ?? true,
      },
    });

    return NextResponse.json(availability, { status: 201 });
  } catch (error) {
    console.error("Availability create error:", error);
    return NextResponse.json(
      { error: "Müsaitlik bilgisi eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
