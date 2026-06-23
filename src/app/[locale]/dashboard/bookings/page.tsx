import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

  const bookings = await prisma.booking.findMany({
    where: { renterId: session.userId },
    include: {
      car: {
        select: {
          id: true,
          brand: true,
          model: true,
          year: true,
          images: { take: 1, orderBy: { isPrimary: "desc" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
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
