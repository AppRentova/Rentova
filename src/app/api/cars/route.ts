import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { carSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const transmission = searchParams.get("transmission");
    const seats = searchParams.get("seats");

    const where: any = { isActive: true };

    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }

    if (minPrice || maxPrice) {
      where.pricePerDay = {};
      if (minPrice) where.pricePerDay.gte = parseFloat(minPrice);
      if (maxPrice) where.pricePerDay.lte = parseFloat(maxPrice);
    }

    if (transmission) {
      where.transmission = transmission;
    }

    if (seats) {
      where.seats = { gte: parseInt(seats) };
    }

    const cars = await prisma.car.findMany({
      where,
      include: {
        images: { take: 3, orderBy: { isPrimary: "desc" } },
        owner: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(cars);
  } catch (error) {
    console.error("Cars fetch error:", error);
    return NextResponse.json(
      { error: "AraÃ§lar yÃ¼klenirken bir hata oluÅŸtu" },
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
    const data = carSchema.parse(body);
    const imageUrls = Array.isArray(data.images)
      ? data.images.map((url) => url.trim()).filter(Boolean).slice(0, 8)
      : [];

    const createdCar = await prisma.car.create({
      data: {
        ownerId: session.userId,
        brand: data.brand,
        model: data.model,
        year: data.year,
        transmission: data.transmission,
        fuelType: data.fuelType,
        seats: data.seats,
        pricePerHour: data.pricePerHour,
        pricePerDay: data.pricePerDay,
        deposit: data.deposit,
        description: data.description,
        lat: data.lat,
        lng: data.lng,
        address: data.address,
        city: data.city,
      },
    });

    if (imageUrls.length > 0) {
      await prisma.carImage.createMany({
        data: imageUrls.map((url, index) => ({
          carId: createdCar.id,
          url,
          isPrimary: index === 0,
        })),
      });
    }

    const car = await prisma.car.findUnique({
      where: { id: createdCar.id },
      include: {
        images: true,
        owner: { select: { name: true } },
      },
    });

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error("Car create error:", error);
    return NextResponse.json(
      { error: "AraÃ§ eklenirken bir hata oluÅŸtu" },
      { status: 500 }
    );
  }
}
