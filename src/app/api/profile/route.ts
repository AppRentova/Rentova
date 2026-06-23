import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "GiriÅŸ yapmalÄ±sÄ±nÄ±z" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, phone: true, image: true },
    });

    if (!user) {
      return NextResponse.json({ error: "KullanÄ±cÄ± bulunamadÄ±" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Bir hata oluÅŸtu" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "GiriÅŸ yapmalÄ±sÄ±nÄ±z" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, image, currentPassword, newPassword } = body;

    const updateData: {
      name?: string;
      phone?: string | null;
      image?: string | null;
      password?: string;
    } = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 2) {
        return NextResponse.json(
          { error: "Ad en az 2 karakter olmalÄ±dÄ±r" },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (phone !== undefined) {
      updateData.phone = phone ? String(phone).trim() : null;
    }

    if (image !== undefined) {
      updateData.image = image ? String(image).trim() : null;
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Mevcut ÅŸifrenizi girin" }, { status: 400 });
      }
      if (String(newPassword).length < 6) {
        return NextResponse.json(
          { error: "Yeni ÅŸifre en az 6 karakter olmalÄ±dÄ±r" },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({ where: { id: session.userId } });
      if (!user) {
        return NextResponse.json({ error: "KullanÄ±cÄ± bulunamadÄ±" }, { status: 404 });
      }

      const bcrypt = await import("bcryptjs");
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ error: "Mevcut ÅŸifre hatalÄ±" }, { status: 401 });
      }

      updateData.password = await hashPassword(String(newPassword));
    }

    if (Object.keys(updateData).length === 0) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, name: true, email: true, phone: true, image: true },
      });

      return NextResponse.json(user);
    }

    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
      select: { id: true, name: true, email: true, phone: true, image: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Profil gÃ¼ncellenirken bir hata oluÅŸtu" },
      { status: 500 }
    );
  }
}
