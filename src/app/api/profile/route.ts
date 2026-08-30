import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, phone, role")
      .eq("id", session.userId)
      .single();

    if (error) {
      return NextResponse.json({ error: "Profil yüklenemedi" }, { status: 500 });
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Profil yüklenemedi" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone } = body;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .update({
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
      })
      .eq("id", session.userId)
      .select("id, name, email, phone, role")
      .single();

    if (error) {
      return NextResponse.json({ error: "Profil güncellenemedi" }, { status: 500 });
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Profil güncellenemedi" }, { status: 500 });
  }
}
