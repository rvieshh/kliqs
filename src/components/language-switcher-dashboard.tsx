"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Locale } from "@/i18n/dictionaries";

// ─────────────────────────────────────────────────────────────────────────────
// Language Switcher — Compact EN/ID toggle for the dashboard sidebar/header.
// ─────────────────────────────────────────────────────────────────────────────

export function LanguageSwitcherDashboard() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
      <LangButton current={locale} value="en" label="EN" onClick={setLocale} />
      <LangButton current={locale} value="id" label="ID" onClick={setLocale} />
    </div>
  );
}

function LangButton({
  current,
  value,
  label,
  onClick,
}: {
  current: Locale;
  value: Locale;
  label: string;
  onClick: (locale: Locale) => void;
}) {
  const isActive = current === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-2 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
        isActive
          ? "bg-white text-[#4361ee] shadow-sm"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}
