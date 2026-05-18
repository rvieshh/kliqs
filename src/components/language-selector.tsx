"use client";

import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { usePathname, useRouter } from "next/navigation";

export function LanguageSelector() {
  const { locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(newLocale: "en" | "id") {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    // Replace the current locale segment in the path
    // Path could be /en, /id, /en/something, /id/something, or no locale prefix
    const segments = pathname.split("/").filter(Boolean);
    const currentLocaleInPath = segments[0] === "en" || segments[0] === "id";

    let newPath: string;
    if (currentLocaleInPath) {
      segments[0] = newLocale;
      newPath = "/" + segments.join("/");
    } else {
      newPath = "/" + newLocale;
    }

    // Set cookie to persist user's explicit language preference
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    setIsOpen(false);
    router.push(newPath);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-[#3C3C3C] bg-transparent hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 cursor-pointer"
      >
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="uppercase">{locale}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-[60] animate-fade-in-up">
          <button
            onClick={() => switchLocale("id")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
              locale === "id"
                ? "bg-[#635bff]/5 text-[#635bff]"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="text-base">🇮🇩</span>
            Bahasa Indonesia
          </button>
          <button
            onClick={() => switchLocale("en")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
              locale === "en"
                ? "bg-[#635bff]/5 text-[#635bff]"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="text-base">🇺🇸</span>
            English
          </button>
        </div>
      )}
    </div>
  );
}
