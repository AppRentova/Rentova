import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n";
import { getSession } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Rentova - Araç Kiralama ve Kiralık Araç",
  description:
    "Türkiye'nin en kolay araç kiralama platformu. Saatlik veya günlük araç kiralayın, aracınızı kiraya verin.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const session = await getSession();

  return (
    <>
      <Header messages={messages} locale={locale} session={session} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer messages={messages} locale={locale} />
    </>
  );
}
