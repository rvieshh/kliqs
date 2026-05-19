"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import {
  Link2,
  BarChart3,
  QrCode,
  User,
  Settings,
  LayoutDashboard,
  Bell,
  Loader2,
  LogOut,
  Plus,
  Download,
  Palette,
  LinkIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// QR Codes Page — Kliqs.me Dashboard
// Grid layout for displaying and managing generated QR codes.
// Clean aesthetic with primary CTA and structured cards.
// ─────────────────────────────────────────────────────────────────────────────

export default function QRCodesPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc]">
        <Loader2 className="w-8 h-8 text-[#7c3aed] animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const gravatarHash = (session?.user as Record<string, unknown> | undefined)?.gravatarHash as string | undefined;
  const gravatarUrl = gravatarHash
    ? `https://www.gravatar.com/avatar/${gravatarHash}?d=retro&s=40`
    : null;
  const userName = session?.user?.name || "User";

  return (
    <div className="min-h-screen flex bg-[#f7f9fc]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 px-4 py-6 sticky top-0 h-screen">
        <div className="px-3 mb-8">
          <Image src="/logo.svg" alt="Kliqs.me" width={110} height={28} className="h-7 w-auto" />
        </div>
        <nav className="flex-1 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" />
          <SidebarItem icon={BarChart3} label="Analytics" href="#" />
          <SidebarItem icon={Link2} label="Links" href="/links" />
          <SidebarItem icon={QrCode} label="QR Codes" href="/qr-codes" active />
          <SidebarItem icon={User} label="Bio Page" href="/bio-page" />
          <SidebarItem icon={Settings} label="Settings" href="#" />
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2">
            {gravatarUrl ? (
              <img src={gravatarUrl} alt={userName} className="w-9 h-9 rounded-xl ring-2 ring-gray-100" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center">
                <span className="text-sm font-bold text-[#7c3aed]">{userName.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-400">Free Plan</p>
            </div>
            <button onClick={() => signOut({ callbackUrl: "https://home.kliqs.me" })} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#f7f9fc]/80 backdrop-blur-sm border-b border-gray-100 px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">QR Codes</h1>
              <p className="text-sm text-gray-400 mt-0.5">Generate and customize QR codes for your links</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-gray-600 hover:border-gray-200 transition-all cursor-pointer">
                <Bell className="w-4.5 h-4.5" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] hover:shadow-lg hover:shadow-[#4361ee]/20 transition-all cursor-pointer">
                <Plus className="w-4 h-4" />
                Create QR Code
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-6 lg:px-8 py-8">
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center mb-6">
              <QrCode className="w-10 h-10 text-[#7c3aed]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No QR codes yet</h2>
            <p className="text-sm text-gray-400 mb-8 text-center max-w-sm">
              Create beautifully customized QR codes that link to your URLs. Track scans and engagement in real-time.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl w-full">
              <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mx-auto mb-3">
                  <Palette className="w-5 h-5 text-[#7c3aed]" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Custom Colors</h3>
                <p className="text-xs text-gray-400">Match your brand identity</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mx-auto mb-3">
                  <Download className="w-5 h-5 text-[#7c3aed]" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Multiple Formats</h3>
                <p className="text-xs text-gray-400">PNG, SVG, and PDF export</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mx-auto mb-3">
                  <LinkIcon className="w-5 h-5 text-[#7c3aed]" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Dynamic Links</h3>
                <p className="text-xs text-gray-400">Update destination anytime</p>
              </div>
            </div>

            <button className="flex items-center gap-2 px-5 py-3 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] hover:shadow-lg hover:shadow-[#4361ee]/20 transition-all cursor-pointer">
              <Plus className="w-4 h-4" />
              Generate Your First QR Code
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar Item
// ─────────────────────────────────────────────────────────────────────────────
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
          ? "bg-[#7c3aed]/5 text-[#7c3aed]"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-4.5 h-4.5" />
      {label}
    </Link>
  );
}
