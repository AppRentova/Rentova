import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

const MAX_SIZE = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: "Yalnızca JPEG, PNG, WEBP, GIF veya AVIF yüklenebilir" },
        { status: 400 },
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Dosya boyutu 8 MB'dan büyük olamaz" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const fileName = `${uuidv4()}.${ext}`;
    const pathInBucket = `${session.userId}/${fileName}`;

    const supabase = await createServiceClient();
    const { error: uploadError } = await supabase.storage
      .from("car-images")
      .upload(pathInBucket, bytes, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "Dosya yüklenemedi" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("car-images")
      .getPublicUrl(pathInBucket);

    return NextResponse.json({ url: urlData.publicUrl, fileName }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Dosya yüklenirken bir hata oluştu" }, { status: 500 });
  }
}
