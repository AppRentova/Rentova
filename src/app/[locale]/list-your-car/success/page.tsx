import Link from "next/link";

export default async function ListCarSuccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-sm flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Aracınız yayında!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Aracınız başarıyla listelendi. Kullanıcılar artık aracınızı kiralayabilir.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={`/${locale}/dashboard/cars`}
          className="inline-flex items-center justify-center px-8 py-3 bg-black text-white font-medium rounded-sm hover:bg-gray-800 transition-colors"
        >
          Paneli\'me Git
        </Link>
        <Link
          href={`/${locale}/search`}
          className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-sm hover:bg-gray-50 transition-colors"
        >
          İlanları Gör
        </Link>
      </div>
    </div>
  );
}
