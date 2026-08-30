import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Hanken_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Rentova - Arac Kiralama ve Kiralik Arac",
  description:
    "Turkiye'nin en kolay arac kiralama platformu. Saatlik veya gunluk arac kiralayin, aracinizi kiraya verin.",
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
      className={`${hankenGrotesk.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] antialiased transition-colors">
        {children}
      </body>
    </html>
  );
}
