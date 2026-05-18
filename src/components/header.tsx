"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

// ─────────────────────────────────────────────────────────────────────────────
// Language Flag Toggle — iOS-style segmented control with flag icons
// Shared between desktop header and mobile menu
// ─────────────────────────────────────────────────────────────────────────────

function LanguageFlagToggle() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: "en" | "id") {
    if (newLocale === locale) return;

    const segments = pathname.split("/").filter(Boolean);
    const currentLocaleInPath = segments[0] === "en" || segments[0] === "id";

    let newPath: string;
    if (currentLocaleInPath) {
      segments[0] = newLocale;
      newPath = "/" + segments.join("/");
    } else {
      newPath = "/" + newLocale;
    }

    const domain = window.location.hostname.includes("kliqs.me") ? "; domain=.kliqs.me" : "";
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax${domain}`;
    router.push(newPath);
  }

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center bg-gray-100 rounded-full p-1 w-[140px] h-[44px]">
        {/* Sliding pill background */}
        <div
          className={`absolute top-1 h-[36px] w-[64px] bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
            locale === "id" ? "translate-x-0" : "translate-x-[68px]"
          }`}
        />

        {/* ID Flag Button */}
        <button
          onClick={() => switchLocale("id")}
          className={`relative z-10 flex items-center justify-center w-[64px] h-[36px] rounded-full transition-opacity duration-200 cursor-pointer ${
            locale === "id" ? "opacity-100" : "opacity-50 hover:opacity-75"
          }`}
          aria-label="Switch to Bahasa Indonesia"
        >
          <Image src="/id.svg" alt="ID" width={24} height={24} className="w-6 h-6 rounded-sm" />
        </button>

        {/* EN Flag Button */}
        <button
          onClick={() => switchLocale("en")}
          className={`relative z-10 flex items-center justify-center w-[64px] h-[36px] rounded-full transition-opacity duration-200 cursor-pointer ${
            locale === "en" ? "opacity-100" : "opacity-50 hover:opacity-75"
          }`}
          aria-label="Switch to English"
        >
          <Image src="/en.svg" alt="EN" width={24} height={24} className="w-6 h-6 rounded-sm" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Header Component — Floating pill header with responsive mobile menu
// ─────────────────────────────────────────────────────────────────────────────

export function Header() {
  const { data: session } = useSession();
  const { dict } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close menu on resize to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { label: dict.nav.shortener, href: "#" },
    { label: dict.nav.analytics, href: "#" },
    { label: dict.nav.qrCodes, href: "#" },
    { label: dict.nav.microsite, href: "#" },
    { label: dict.nav.pricing, href: "#" },
  ];

  const ctaLabel = session?.user ? dict.nav.dashboard : dict.nav.loginRegister;
  const ctaHref = session?.user
    ? "https://dash.kliqs.me/dashboard"
    : "https://dash.kliqs.me/login";

  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
        <nav className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-xl px-6 py-3.5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Kliqs.me" width={120} height={32} className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Right Side: Language Toggle + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageFlagToggle />
            <a
              href={ctaHref}
              className="px-6 py-3 bg-[#635bff] text-white text-sm font-semibold rounded-lg hover:bg-[#5145e5] active:bg-[#4538d4] shadow-[0_2px_6px_rgba(99,91,255,0.15)] transition-all"
            >
              {ctaLabel}
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          MOBILE MENU OVERLAY
      ═══════════════════════════════════════════════════════════════════════ */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-[96px] left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
            <div className="flex flex-col p-4">
              {/* Navigation Links */}
              <div className="flex flex-col">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-4 min-h-[48px] text-base font-medium text-gray-700 hover:text-[#635bff] hover:bg-[#635bff]/5 rounded-xl transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* Divider */}
              <div className="my-3 border-t border-gray-100" />

              {/* Language Toggle */}
              <div className="px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Language
                </p>
                <LanguageFlagToggle />
              </div>

              {/* Divider */}
              <div className="my-3 border-t border-gray-100" />

              {/* CTA Button */}
              <div className="px-4 pb-2">
                <a
                  href={ctaHref}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full px-6 py-3.5 bg-[#635bff] text-white text-base font-semibold rounded-xl hover:bg-[#5145e5] active:bg-[#4538d4] shadow-[0_2px_6px_rgba(99,91,255,0.15)] transition-all"
                >
                  {ctaLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
