import { getMessages, getLocale } from "@/lib/i18n";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { CarCategories } from "@/components/home/CarCategories";
import { CTA } from "@/components/home/CTA";

export default async function HomePage() {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <>
      <Hero messages={messages} locale={locale} />
      <Features messages={messages} />
      <CarCategories messages={messages} locale={locale} />
      <CTA messages={messages} locale={locale} />
    </>
  );
}
