import { notFound } from "next/navigation";
import { locales, getDictionary, type Locale } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n/context";
import HomePage from "../page";

interface Props {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleHomePage({ params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const dict = getDictionary(locale as Locale);

  return (
    <I18nProvider locale={locale as Locale} dict={dict}>
      <HomePage />
    </I18nProvider>
  );
}
