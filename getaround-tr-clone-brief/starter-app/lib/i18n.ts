export const locales = ["en", "tr"] as const;
export type Locale = (typeof locales)[number];

const messages = {
  en: {
    navigation: { cars: "Cars", howItWorks: "How it works", owners: "For owners", help: "Help", signIn: "Sign in", signUp: "Create account" },
    home: { title: "Choose the car. Keep the freedom.", description: "Nearby cars from verified owners, available by the hour or day.", nearbyTitle: "Available near you", nearbyDescription: "Illustrative inventory for the MVP" },
  },
  tr: {
    navigation: { cars: "Araçlar", howItWorks: "Nasıl çalışır", owners: "Araç sahipleri", help: "Yardım", signIn: "Giriş yap", signUp: "Hesap oluştur" },
    home: { title: "Aracını seç. Özgürlüğün sende kalsın.", description: "Doğrulanmış sahiplerden yakınındaki araçları saatlik veya günlük kirala.", nearbyTitle: "Yakınındaki araçlar", nearbyDescription: "MVP için temsili envanter" },
  },
} satisfies Record<Locale, unknown>;

export function getMessages(locale: Locale) { return messages[locale]; }
export function formatCurrency(value: number, locale: Locale = "en") { return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-GB", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(value); }
