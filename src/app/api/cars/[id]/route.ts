import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        images: { orderBy: { isPrimary: "desc" } },
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
          },
        },
        reviews: {
          include: {
            reviewer: { select: { name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!car) {
      return NextResponse.json({ error: "Araç bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error("Car fetch error:", error);
    return NextResponse.json(
      { error: "Araç bilgisi yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
    }

    const { id } = await params;
    const car = await prisma.car.findUnique({ where: { id } });

    if (!car) {
      return NextResponse.json({ error: "Araç bulunamadı" }, { status: 404 });
    }

    if (car.ownerId !== session.userId && session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bu aracı düzenleme yetkiniz yok" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { brand, model, year, transmission, fuelType, seats, pricePerHour, pricePerDay, deposit, description, lat, lng, address, city, isActive } = body;

    const updated = await prisma.car.update({
      where: { id },
      data: {
        ...(brand !== undefined && { brand }),
        ...(model !== undefined && { model }),
        ...(year !== undefined && { year }),
        ...(transmission !== undefined && { transmission }),
        ...(fuelType !== undefined && { fuelType }),
        ...(seats !== undefined && { seats }),
        ...(pricePerHour !== undefined && { pricePerHour }),
        ...(pricePerDay !== undefined && { pricePerDay }),
        ...(deposit !== undefined && { deposit }),
        ...(description !== undefined && { description }),
        ...(lat !== undefined && { lat }),
        ...(lng !== undefined && { lng }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        images: { orderBy: { isPrimary: "desc" } },
        owner: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Car update error:", error);
    return NextResponse.json(
      { error: "Araç güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
    }

    const { id } = await params;
    const car = await prisma.car.findUnique({ where: { id } });

    if (!car) {
      return NextResponse.json({ error: "Araç bulunamadı" }, { status: 404 });
    }

    if (car.ownerId !== session.userId && session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bu aracı silme yetkiniz yok" },
        { status: 403 }
      );
    }

    await prisma.car.delete({ where: { id } });
    return NextResponse.json({ message: "Araç silindi" });
  } catch (error) {
    console.error("Car delete error:", error);
    return NextResponse.json(
      { error: "Araç silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
