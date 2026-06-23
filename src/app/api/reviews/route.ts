import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const carId = searchParams.get("carId");

    const where = carId ? { carId } : {};

    const reviews = await prisma.review.findMany({
      where,
      include: {
        reviewer: { select: { name: true, image: true } },
        booking: { select: { startDate: true, endDate: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json(
      { error: "Değerlendirmeler yüklenirken bir hata oluştu" },
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
    const { bookingId, rating, comment } = body;

    if (!bookingId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Geçerli bir değerlendirme puanı girin (1-5)" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: "Rezervasyon bulunamadı" }, { status: 404 });
    }

    if (booking.renterId !== session.userId) {
      return NextResponse.json(
        { error: "Bu rezervasyonu değerlendirme yetkiniz yok" },
        { status: 403 }
      );
    }

    if (booking.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Sadece tamamlanmış rezervasyonlar değerlendirilebilir" },
        { status: 400 }
      );
    }

    const existing = await prisma.review.findUnique({ where: { bookingId } });
    if (existing) {
      return NextResponse.json(
        { error: "Bu rezervasyon zaten değerlendirildi" },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        bookingId,
        reviewerId: session.userId,
        carId: booking.carId,
        rating,
        comment: comment || null,
      },
      include: {
        reviewer: { select: { name: true, image: true } },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Review create error:", error);
    return NextResponse.json(
      { error: "Değerlendirme eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
