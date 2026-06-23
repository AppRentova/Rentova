import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const ACTIVE_BOOKING_STATUSES = ["PENDING", "CONFIRMED", "ACTIVE"] as const;

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "GiriÅŸ yapmalÄ±sÄ±nÄ±z" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Rezervasyon ID gerekli" }, { status: 400 });
    }

    const body = await request.json();
    const { status: newStatus } = body;

    if (!newStatus) {
      return NextResponse.json({ error: "GÃ¼ncellenecek durum gerekli" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ error: "Rezervasyon bulunamadÄ±" }, { status: 404 });
    }

    if (booking.renterId !== session.userId && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Bu iÅŸlem iÃ§in yetkiniz yok" }, { status: 403 });
    }

    if (newStatus === "CANCELLED" && booking.status === "COMPLETED") {
      return NextResponse.json(
        { error: "TamamlanmÄ±ÅŸ rezervasyon iptal edilemez" },
        { status: 400 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: newStatus },
      include: {
        car: {
          select: { id: true, brand: true, model: true, year: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Booking update error:", error);
    return NextResponse.json(
      { error: "Rezervasyon gÃ¼ncellenirken bir hata oluÅŸtu" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "GiriÅŸ yapmalÄ±sÄ±nÄ±z" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        renterId: session.userId,
      },
      include: {
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            year: true,
            images: { take: 1, orderBy: { isPrimary: "desc" } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Bookings fetch error:", error);
    return NextResponse.json(
      { error: "Rezervasyonlar yÃ¼klenirken bir hata oluÅŸtu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "GiriÅŸ yapmalÄ±sÄ±nÄ±z" }, { status: 401 });
    }

    const body = await request.json();
    const { carId, startDate, endDate } = body;

    if (!carId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "AraÃ§, baÅŸlangÄ±Ã§ tarihi ve bitiÅŸ tarihi gerekli" },
        { status: 400 }
      );
    }

    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
      return NextResponse.json({ error: "AraÃ§ bulunamadÄ±" }, { status: 404 });
    }

    if (car.ownerId === session.userId) {
      return NextResponse.json(
        { error: "Kendi aracÄ±nÄ±zÄ± kiralayamazsÄ±nÄ±z" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return NextResponse.json({ error: "GeÃ§erli tarihler girin" }, { status: 400 });
    }

    if (end <= start) {
      return NextResponse.json(
        { error: "BitiÅŸ tarihi baÅŸlangÄ±Ã§ tarihinden sonra olmalÄ±dÄ±r" },
        { status: 400 }
      );
    }

    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.pricePerDay;

    const overlapping = await prisma.booking.findFirst({
      where: {
        carId,
        status: { in: [...ACTIVE_BOOKING_STATUSES] },
        AND: [{ startDate: { lt: end } }, { endDate: { gt: start } }],
      },
    });

    if (overlapping) {
      return NextResponse.json(
        { error: "Bu tarihlerde araÃ§ mÃ¼sait deÄŸil" },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        carId,
        renterId: session.userId,
        startDate: start,
        endDate: end,
        totalPrice,
        status: "CONFIRMED",
      },
      include: {
        car: {
          select: { brand: true, model: true },
        },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Booking create error:", error);
    return NextResponse.json(
      { error: "Rezervasyon oluÅŸturulurken bir hata oluÅŸtu" },
      { status: 500 }
    );
  }
}
