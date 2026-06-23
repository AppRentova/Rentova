import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MyCarsPage({ params }: { params: Promise<{ locale: string }> }) {
  const session = await getSession();
  const { locale } = await params;

  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  const cars = await prisma.car.findMany({
    where: { ownerId: session.userId },
    include: {
      images: { take: 1, orderBy: { isPrimary: "desc" } },
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Araçlarım</h1>
        <Link
          href={`/${locale}/list-your-car`}
          className="inline-flex items-center px-5 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
        >
          Yeni Araç Ekle
        </Link>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-medium text-gray-900">Henüz araç eklemediniz</h3>
          <p className="text-gray-600 mt-2">Aracınızı listeleyerek kazanmaya başlayın.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start"
            >
              <div className="w-full sm:w-24 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                {car.images[0]?.url ? (
                  <img
                    src={car.images[0].url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">🚗</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">
                  {car.brand} {car.model} ({car.year})
                </h3>
                <p className="text-sm text-gray-600 mt-1">{car.city}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>{car._count.bookings} rezervasyon</span>
                  <span>{car.pricePerDay.toLocaleString("tr-TR")} TL/gün</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/${locale}/cars/${car.id}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Görüntüle
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
