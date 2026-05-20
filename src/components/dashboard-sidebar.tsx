"use client";

import { signOut, useSession } from "next-auth/react";
import {
  Link2,
  BarChart3,
  QrCode,
  User,
  Settings,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcherDashboard } from "@/components/language-switcher-dashboard";

// ─────────────────────────────────────────────────────────────────────────────
// Centralized Dashboard Sidebar — Single source of truth for navigation.
// Supports both desktop (static) and mobile (overlay drawer) modes.
// Uses i18n context for translated labels.
// ─────────────────────────────────────────────────────────────────────────────

export const SIDEBAR_NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", translationKey: "nav.dashboard" },
  { icon: BarChart3, label: "Analytics", href: "/analytics", translationKey: "nav.analytics" },
  { icon: Link2, label: "Links", href: "/links", translationKey: "nav.links" },
  { icon: QrCode, label: "QR Codes", href: "/qr-codes", translationKey: "nav.qrCodes" },
  { icon: User, label: "Bio Page", href: "/bio-page", translationKey: "nav.bioPage" },
  { icon: Settings, label: "Settings", href: "/settings", translationKey: "nav.settings" },
] as const;

interface DashboardSidebarProps {
  activePage?: string;
}

export function DashboardSidebar({ activePage = "Dashboard" }: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* Mobile Header — visible only on small screens */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white border-b border-gray-100 px-4 py-3">
        <Image src="/logo.svg" alt="Kliqs.me" width={100} height={26} className="h-6 w-auto" />
        <div className="flex items-center gap-2">
          <LanguageSwitcherDashboard />
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Overlay Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeMobile}
          />
          {/* Drawer */}
          <aside className="absolute top-0 left-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            {/* Close button */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <Image src="/logo.svg" alt="Kliqs.me" width={100} height={26} className="h-6 w-auto" />
              <button
                onClick={closeMobile}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {SIDEBAR_NAV_ITEMS.map((item) => (
                <SidebarItem
                  key={item.label}
                  icon={item.icon}
                  label={t(item.translationKey)}
                  href={item.href}
                  active={item.label === activePage}
                  onClick={closeMobile}
                />
              ))}
            </nav>
            {/* User Profile */}
            <MobileSidebarFooter />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar — hidden on mobile */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 px-4 py-6 sticky top-0 h-screen">
        {/* Logo + Language Switcher */}
        <div className="px-3 mb-8 flex items-center justify-between">
          <Image src="/logo.svg" alt="Kliqs.me" width={110} height={28} className="h-7 w-auto" />
          <LanguageSwitcherDashboard />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {SIDEBAR_NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={t(item.translationKey)}
              href={item.href}
              active={item.label === activePage}
            />
          ))}
        </nav>

        {/* User Profile */}
        <DesktopSidebarFooter />
      </aside>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-Components
// ─────────────────────────────────────────────────────────────────────────────

function SidebarItem({
  icon: Icon,
  label,
  href,
  active = false,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-[#4361ee]/5 text-[#4361ee]"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-4.5 h-4.5" />
      {label}
    </Link>
  );
}

function DesktopSidebarFooter() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const gravatarHash = (session?.user as Record<string, unknown> | undefined)?.gravatarHash as string | undefined;
  const gravatarUrl = gravatarHash
    ? `https://www.gravatar.com/avatar/${gravatarHash}?d=retro&s=40`
    : null;
  const userName = session?.user?.name || "User";

  return (
    <div className="mt-auto pt-4 border-t border-gray-100">
      <div className="flex items-center gap-3 px-3 py-2">
        {gravatarUrl ? (
          <img src={gravatarUrl} alt={userName} className="w-9 h-9 rounded-xl ring-2 ring-gray-100" />
        ) : (
          <div className="w-9 h-9 rounded-xl bg-[#4361ee]/10 flex items-center justify-center">
            <span className="text-sm font-bold text-[#4361ee]">{userName.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
          <p className="text-xs text-gray-400">{t("nav.freePlan")}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "https://home.kliqs.me" })}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          title={t("nav.signOut")}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function MobileSidebarFooter() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const gravatarHash = (session?.user as Record<string, unknown> | undefined)?.gravatarHash as string | undefined;
  const gravatarUrl = gravatarHash
    ? `https://www.gravatar.com/avatar/${gravatarHash}?d=retro&s=40`
    : null;
  const userName = session?.user?.name || "User";

  return (
    <div className="px-4 py-4 border-t border-gray-100">
      <div className="flex items-center gap-3 px-2 py-2">
        {gravatarUrl ? (
          <img src={gravatarUrl} alt={userName} className="w-9 h-9 rounded-xl ring-2 ring-gray-100" />
        ) : (
          <div className="w-9 h-9 rounded-xl bg-[#4361ee]/10 flex items-center justify-center">
            <span className="text-sm font-bold text-[#4361ee]">{userName.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
          <p className="text-xs text-gray-400">{t("nav.freePlan")}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "https://home.kliqs.me" })}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          title={t("nav.signOut")}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
