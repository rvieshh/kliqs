import { en, type Translations } from "./en";
import { id } from "./id";

export type Locale = "en" | "id";

export const locales: Locale[] = ["en", "id"];

export const dictionaries: Record<Locale, Translations> = {
  en,
  id,
};

export function getDictionary(locale: Locale): Translations {
  return dictionaries[locale] ?? en;
}

export type { Translations };
