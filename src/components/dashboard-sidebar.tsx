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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Centralized Dashboard Sidebar — Single source of truth for navigation.
// ─────────────────────────────────────────────────────────────────────────────

export const SIDEBAR_NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Link2, label: "Links", href: "/links" },
  { icon: QrCode, label: "QR Codes", href: "/qr-codes" },
  { icon: User, label: "Bio Page", href: "/bio-page" },
  { icon: Settings, label: "Settings", href: "/settings" },
] as const;

interface DashboardSidebarProps {
  activePage?: string; // label of the active page (e.g. "Dashboard", "Links")
}

export function DashboardSidebar({ activePage = "Dashboard" }: DashboardSidebarProps) {
  const { data: session } = useSession();

  const gravatarHash = (session?.user as Record<string, unknown> | undefined)?.gravatarHash as string | undefined;
  const gravatarUrl = gravatarHash
    ? `https://www.gravatar.com/avatar/${gravatarHash}?d=retro&s=40`
    : null;
  const userName = session?.user?.name || "User";

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 px-4 py-6 sticky top-0 h-screen">
      {/* Logo */}
      <div className="px-3 mb-8">
        <Image src="/logo.svg" alt="Kliqs.me" width={110} height={28} className="h-7 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {SIDEBAR_NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={item.label === activePage}
          />
        ))}
      </nav>

      {/* User Profile */}
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
            <p className="text-xs text-gray-400">Free Plan</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "https://home.kliqs.me" })}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  href,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
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
