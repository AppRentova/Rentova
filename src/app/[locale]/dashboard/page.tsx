import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const session = await getSession();
  const { locale } = await params;

  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  const bookingsCount = await prisma.booking.count({
    where: { renterId: session.userId },
  });

  const carsCount = await prisma.car.count({
    where: { ownerId: session.userId },
  });

  const activeBookings = await prisma.booking.count({
    where: {
      renterId: session.userId,
      status: { in: ["CONFIRMED", "ACTIVE"] },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Panelim</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm">
          <p className="text-3xl font-bold text-gray-900">{bookingsCount}</p>
          <p className="text-sm text-gray-600 mt-1">Toplam Rezervasyon</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm">
          <p className="text-3xl font-bold text-green-600">{activeBookings}</p>
          <p className="text-sm text-gray-600 mt-1">Aktif Rezervasyon</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm">
          <p className="text-3xl font-bold text-gray-900">{carsCount}</p>
          <p className="text-sm text-gray-600 mt-1">Listelenen Araç</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href={`/${locale}/dashboard/bookings`}
          className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-sm hover:shadow-sm transition-shadow"
        >
          <div>
            <h3 className="font-semibold text-gray-900">Rezervasyonlarım</h3>
            <p className="text-sm text-gray-600 mt-1">Tüm rezervasyonlarınızı görüntüleyin</p>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <Link
          href={`/${locale}/dashboard/cars`}
          className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-sm hover:shadow-sm transition-shadow"
        >
          <div>
            <h3 className="font-semibold text-gray-900">Araçlarım</h3>
            <p className="text-sm text-gray-600 mt-1">Araçlarınızı yönetin</p>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <Link
          href={`/${locale}/dashboard/profile`}
          className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-sm hover:shadow-sm transition-shadow"
        >
          <div>
            <h3 className="font-semibold text-gray-900">Profil</h3>
            <p className="text-sm text-gray-600 mt-1">Profil bilgilerinizi düzenleyin</p>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <Link
          href={`/${locale}/list-your-car`}
          className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-sm hover:shadow-sm transition-shadow"
        >
          <div>
            <h3 className="font-semibold text-gray-900">Araç Ekle</h3>
            <p className="text-sm text-gray-600 mt-1">Yeni bir araç listeleyin</p>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
