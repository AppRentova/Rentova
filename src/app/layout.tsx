import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rentova - Araç Kiralama ve Kiralık Araç",
  description:
    "Türkiye'nin en kolay araç kiralama platformu. Saatlik veya günlük araç kiralayın, aracınızı kiraya verin.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("rentova_locale")?.value === "en" ? "en" : "tr";

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-white font-sans antialiased">{children}</body>
    </html>
  );
}
