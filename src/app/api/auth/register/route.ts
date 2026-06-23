import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanılıyor" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        password: hashedPassword,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Kayıt sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
