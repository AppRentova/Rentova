import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Ad, e-posta ve şifre gerekli" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone: phone ?? null } },
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || "Kayıt başarısız" },
        { status: 400 },
      );
    }

    const { data: profile } = await supabase
      .from("users")
      .select("id, name, email, role")
      .eq("id", data.user.id)
      .maybeSingle();

    return NextResponse.json(
      {
        user: profile ?? { id: data.user.id, name, email, role: "USER" },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Kayıt sırasında bir hata oluştu" }, { status: 500 });
  }
}
