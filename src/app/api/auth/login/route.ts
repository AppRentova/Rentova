import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "E-posta veya şifre hatalı" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(data.password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "E-posta veya şifre hatalı" },
        { status: 401 }
      );
    }

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
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Giriş sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
