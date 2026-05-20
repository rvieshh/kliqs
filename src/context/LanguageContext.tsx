"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { dictionaries, type Locale } from "@/i18n/dictionaries";

// ─────────────────────────────────────────────────────────────────────────────
// Language Context — Manages locale state and provides t() translation helper.
// Persists language preference to localStorage.
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "kliqs_locale";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Load saved locale from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && (saved === "en" || saved === "id")) {
        setLocaleState(saved);
      }
    } catch {
      // localStorage not available (SSR or privacy mode)
    }
  }, []);

  // Set locale and persist to localStorage
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // localStorage not available
    }
  }, []);

  // Translation helper — returns the translated string or the key itself as fallback
  const t = useCallback(
    (key: string): string => {
      return dictionaries[locale][key] ?? key;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for consuming the language context
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
