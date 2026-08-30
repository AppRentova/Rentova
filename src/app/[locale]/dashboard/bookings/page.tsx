import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CancelBookingButton } from "@/components/booking/CancelBookingButton";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  ACTIVE: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  PENDING: "Beklemede",
  CONFIRMED: "Onaylandı",
  ACTIVE: "Aktif",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal Edildi",
};

export default async function BookingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const session = await getSession();
  const { locale } = await params;

  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select(
      `id, startDate:start_date, endDate:end_date, totalPrice:total_price, status,
       car:cars(id, brand, model, year, images:car_images(id, url, is_primary))`,
    )
    .eq("renter_id", session.userId)
    .order("created_at", { ascending: false });

  const bookings = (data || []).map((b: any) => {
    const sorted = (b.car?.images || []).slice().sort((a: any, c: any) => (c.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
    return {
      id: b.id,
      startDate: b.startDate,
      endDate: b.endDate,
      totalPrice: b.totalPrice,
      status: b.status,
      car: b.car
        ? { brand: b.car.brand, model: b.car.model, year: b.car.year, images: sorted.length ? [{ url: sorted[0].url }] : [] }
        : { brand: "", model: "", year: 0, images: [] },
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Rezervasyonlarım</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-sm">
          <h3 className="text-lg font-medium text-gray-900">Henüz rezervasyonunuz yok</h3>
          <p className="text-gray-600 mt-2">Bir araç kiralayarak başlayın.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-gray-100 rounded-sm p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start"
            >
              <div className="w-full sm:w-24 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                {booking.car.images[0]?.url ? (
                  <img
                    src={booking.car.images[0].url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">🚗</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">
                  {booking.car.brand} {booking.car.model} ({booking.car.year})
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(booking.startDate).toLocaleDateString("tr-TR")} -{" "}
                  {new Date(booking.endDate).toLocaleDateString("tr-TR")}
                </p>
                <p className="text-sm text-gray-600">
                  {booking.totalPrice.toLocaleString("tr-TR")} TL
                </p>
              </div>

              <div className="flex items-center gap-3">
                {booking.status === "CONFIRMED" && (
                  <CancelBookingButton bookingId={booking.id} locale={locale} />
                )}
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[booking.status]
                  }`}
                >
                  {statusLabels[booking.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
