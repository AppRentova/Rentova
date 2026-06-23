import { cookies } from "next/headers";

export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

const messages: Record<Locale, () => Promise<Record<string, any>>> = {
  tr: () => import("@/messages/tr.json").then((m) => m.default),
  en: () => import("@/messages/en.json").then((m) => m.default),
};

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("rentova_locale")?.value as Locale;
  if (locale && locales.includes(locale)) return locale;
  return defaultLocale;
}

export async function getTranslations(namespace?: string) {
  const locale = await getLocale();
  const msgs = await messages[locale]();

  return function t(key: string, params?: Record<string, string | number>) {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    let value: any = msgs;
    for (const k of fullKey.split(".")) {
      value = value?.[k];
    }
    if (params && typeof value === "string") {
      return value.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
    }
    return value ?? key;
  };
}

export async function getMessages(): Promise<Record<string, any>> {
  const locale = await getLocale();
  return messages[locale]();
}

export async function getMessage(key: string, locale?: Locale): Promise<string> {
  const l = locale ?? (await getLocale());
  const msgs = await messages[l]();
  let value: any = msgs;
  for (const k of key.split(".")) {
    value = value?.[k];
  }
  return value ?? key;
}

export function getLocales() {
  return locales.map((l) => ({
    code: l,
    name: l === "tr" ? "Türkçe" : "English",
  }));
}
