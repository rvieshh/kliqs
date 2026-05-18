"use client";

import { createContext, useContext, type ReactNode } from "react";
import { en, type Translations } from "./en";
import type { Locale } from "./index";

interface I18nContextValue {
  locale: Locale;
  dict: Translations;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  dict: en,
});

export function I18nProvider({
  children,
  locale,
  dict,
}: {
  children: ReactNode;
  locale: Locale;
  dict: Translations;
}) {
  return (
    <I18nContext.Provider value={{ locale, dict }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
