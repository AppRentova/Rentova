import { createClient } from "@supabase/supabase-js";

try {
  (process as any).loadEnvFile?.(".env");
} catch {}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Eksik Supabase ortam değişkeni: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASSWORD = "password123";

const demoUsers = [
  { email: "arsen@rentova.com", name: "Arsen B.", phone: "+905368288181", role: "ADMIN" },
  { email: "eric@example.com", name: "Eric G.", phone: null, role: "USER" },
  { email: "meltem@example.com", name: "Meltem Y.", phone: null, role: "USER" },
];

async function ensureUser(u: { email: string; name: string; phone: string | null; role: string }) {
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: u.email,
    password: PASSWORD,
    user_metadata: { name: u.name, phone: u.phone },
    email_confirm: true,
  });
  if (created?.user) {
    const id = created.user.id;
    await supabase
      .from("users")
      .update({ name: u.name, phone: u.phone, role: u.role })
      .eq("id", id);
    return id;
  }
  if (createError) {
    console.warn(`Kullanıcı oluşturulamadı ${u.email}: ${createError.message}`);
  }
  return null;
}

const carsDef = [
  {
    key: "c1",
    ownerEmail: "eric@example.com",
    brand: "Renault",
    model: "Twingo",
    year: 2012,
    transmission: "MANUAL",
    fuel_type: "GASOLINE",
    seats: 4,
    price_per_hour: 5,
    price_per_day: 36,
    deposit: 100,
    description: "Küçük ve ekonomik şehir içi araç. Park etmesi kolay, az yakıt tüketir.",
    lat: 38.4192,
    lng: 27.1287,
    address: "Alsancak, Cumhuriyet Bulvarı 45, İzmir",
    city: "İzmir",
  },
  {
    key: "c2",
    ownerEmail: "meltem@example.com",
    brand: "Citroen",
    model: "C3",
    year: 2016,
    transmission: "MANUAL",
    fuel_type: "DIESEL",
    seats: 5,
    price_per_hour: 6,
    price_per_day: 33,
    deposit: 150,
    description: "Konforlu ve güvenilir aile aracı. Uzun yol için ideal.",
    lat: 38.4321,
    lng: 27.1423,
    address: "Konak, Kahramanlar, 35230 İzmir",
    city: "İzmir",
  },
  {
    key: "c3",
    ownerEmail: "arsen@rentova.com",
    brand: "Skoda",
    model: "Fabia",
    year: 2017,
    transmission: "MANUAL",
    fuel_type: "GASOLINE",
    seats: 5,
    price_per_hour: 7,
    price_per_day: 55,
    deposit: 200,
    description: "Temiz, bakımlı ve az yıpranmış araç. Bluetooth, klima ve park sensörü mevcut.",
    lat: 38.4588,
    lng: 27.1654,
    address: "Karşıyaka, Atatürk Cad. 78, İzmir",
    city: "İzmir",
  },
  {
    key: "c4",
    ownerEmail: "eric@example.com",
    brand: "Citroen",
    model: "C1",
    year: 2011,
    transmission: "MANUAL",
    fuel_type: "GASOLINE",
    seats: 4,
    price_per_hour: 4,
    price_per_day: 28,
    deposit: 80,
    description: "Ekonomik ve pratik şehir arabası. Düşük yakıt tüketimi.",
    lat: 38.3892,
    lng: 27.0892,
    address: "Balçova, İnciraltı Cad. 23, İzmir",
    city: "İzmir",
  },
];

const imageUrls: Record<string, string> = {
  c1: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
  c2: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
  c3: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
  c4: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
};

const blockedDates = ["2026-09-01", "2026-09-02", "2026-09-03", "2026-09-15", "2026-09-16", "2026-10-10"];

async function main() {
  console.log("🌱 Supabase seed başlatılıyor...");

  const userIds: Record<string, string> = {};
  for (const u of demoUsers) {
    const id = await ensureUser(u);
    if (id) userIds[u.email] = id;
  }

  const required = ["arsen@rentova.com", "eric@example.com", "meltem@example.com"];
  for (const email of required) {
    if (!userIds[email]) {
      console.error(`Gerekli kullanıcı oluşturulamadı: ${email}. Seed durduruldu.`);
      process.exit(1);
    }
  }

  const carPayload = carsDef.map((c) => ({
    owner_id: userIds[c.ownerEmail],
    brand: c.brand,
    model: c.model,
    year: c.year,
    transmission: c.transmission,
    fuel_type: c.fuel_type,
    seats: c.seats,
    price_per_hour: c.price_per_hour,
    price_per_day: c.price_per_day,
    deposit: c.deposit,
    description: c.description,
    lat: c.lat,
    lng: c.lng,
    address: c.address,
    city: c.city,
    is_active: true,
  }));

  const { data: cars, error: carsError } = await supabase
    .from("cars")
    .insert(carPayload)
    .select("id");

  if (carsError || !cars) {
    console.error("Araç seed hatası:", carsError?.message);
    process.exit(1);
  }

  const carIds: Record<string, string> = {};
  carsDef.forEach((c, i) => {
    carIds[c.key] = cars[i].id;
  });

  const { error: imgError } = await supabase.from("car_images").insert(
    Object.entries(imageUrls).map(([key, url]) => ({
      car_id: carIds[key],
      url,
      is_primary: true,
    })),
  );
  if (imgError) console.warn("Görsel seed uyarısı:", imgError.message);

  const { error: availError } = await supabase.from("car_availability").insert(
    blockedDates.flatMap((d) => [
      { car_id: carIds.c1, date: d, is_available: false },
      { car_id: carIds.c2, date: d, is_available: false },
    ]),
  );
  if (availError) console.warn("Müsaitlik seed uyarısı:", availError.message);

  const bookingsDef = [
    {
      carKey: "c1",
      renterEmail: "meltem@example.com",
      reviewerEmail: "meltem@example.com",
      start: "2026-06-10T10:00:00.000Z",
      end: "2026-06-12T18:00:00.000Z",
      price: 2 * 36,
      rating: 5,
      comment: "Araç çok temizdi ve sahibi son derece yardımseverdi. Kesinlikle tavsiye ederim.",
    },
    {
      carKey: "c1",
      renterEmail: "eric@example.com",
      reviewerEmail: "eric@example.com",
      start: "2026-05-20T09:00:00.000Z",
      end: "2026-05-22T19:00:00.000Z",
      price: 2 * 36,
      rating: 4,
      comment: "Ekonomik ve şehir içi kullanım için mükemmel. Park kolaylığı avantaj sağladı.",
    },
    {
      carKey: "c2",
      renterEmail: "arsen@rentova.com",
      reviewerEmail: "arsen@rentova.com",
      start: "2026-04-05T10:00:00.000Z",
      end: "2026-04-08T18:00:00.000Z",
      price: 3 * 33,
      rating: 5,
      comment: "Konforlu bir yolculuk oldu, iletişim hızlıydı ve araç beklentiyi karşıladı.",
    },
  ];

  for (const b of bookingsDef) {
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        car_id: carIds[b.carKey],
        renter_id: userIds[b.renterEmail],
        start_date: b.start,
        end_date: b.end,
        total_price: b.price,
        status: "COMPLETED",
      })
      .select("id")
      .single();

    if (bookingError || !booking) {
      console.warn("Rezervasyon seed uyarısı:", bookingError?.message);
      continue;
    }

    const { error: reviewError } = await supabase.from("reviews").insert({
      booking_id: booking.id,
      reviewer_id: userIds[b.reviewerEmail],
      car_id: carIds[b.carKey],
      rating: b.rating,
      comment: b.comment,
    });
    if (reviewError) console.warn("Yorum seed uyarısı:", reviewError.message);
  }

  console.log("✅ Seed tamamlandı!");
  console.log("   Kullanıcılar: arsen@rentova.com / eric@example.com / meltem@example.com");
  console.log("   Şifre: password123");
  console.log(`   Araçlar: ${cars.length} adet`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  });
