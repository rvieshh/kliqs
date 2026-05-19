"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
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
  Globe,
  Palette,
  Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Bio Page — Kliqs.me Dashboard
// Premium bio page builder with elegant empty state, feature highlights,
// and subtle #03ab0e accents for active/published status indicators.
// ─────────────────────────────────────────────────────────────────────────────

export default function BioPagePage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc]">
        <Loader2 className="w-8 h-8 text-[#4361ee] animate-spin" />
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
          <SidebarItem icon={QrCode} label="QR Codes" href="/qr-codes" />
          <SidebarItem icon={User} label="Bio Page" href="/bio-page" active />
          <SidebarItem icon={Settings} label="Settings" href="#" />
        </nav>
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
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bio Pages</h1>
              <p className="text-sm text-gray-400 mt-0.5">Create and manage your personal bio link pages</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-gray-600 hover:border-gray-200 transition-all cursor-pointer">
                <Bell className="w-4.5 h-4.5" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] hover:shadow-lg hover:shadow-[#4361ee]/20 transition-all cursor-pointer">
                <Plus className="w-4 h-4" />
                Create Bio Page
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-6 lg:px-8 py-8">
          {/* Empty State Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#03ab0e]/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#4361ee]/5 to-transparent rounded-tr-full pointer-events-none" />

              <div className="relative text-center">
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4361ee]/10 to-[#03ab0e]/10 flex items-center justify-center mx-auto mb-6">
                  <User className="w-10 h-10 text-[#4361ee]" />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">Create your Bio Page</h2>
                <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">
                  Build a beautiful, customizable landing page that houses all your important links in one place. Share a single URL across all your platforms.
                </p>

                {/* Status Preview */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#03ab0e]/5 rounded-full mb-8">
                  <span className="w-2 h-2 rounded-full bg-[#03ab0e] animate-pulse" />
                  <span className="text-xs font-medium text-[#03ab0e]">Ready to publish</span>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center mx-auto mb-2.5">
                      <Globe className="w-4.5 h-4.5 text-[#4361ee]" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Custom Domain</h3>
                    <p className="text-xs text-gray-400">Your own branded URL</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center mx-auto mb-2.5">
                      <Palette className="w-4.5 h-4.5 text-[#7c3aed]" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Themes</h3>
                    <p className="text-xs text-gray-400">Beautiful pre-built designs</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center mx-auto mb-2.5">
                      <Share2 className="w-4.5 h-4.5 text-[#03ab0e]" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Social Links</h3>
                    <p className="text-xs text-gray-400">All platforms supported</p>
                  </div>
                </div>

                <button className="flex items-center gap-2 px-5 py-3 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] hover:shadow-lg hover:shadow-[#4361ee]/20 transition-all cursor-pointer mx-auto">
                  <Plus className="w-4 h-4" />
                  Create Your First Bio Page
                </button>
              </div>
            </div>
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
          ? "bg-[#4361ee]/5 text-[#4361ee]"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-4.5 h-4.5" />
      {label}
    </Link>
  );
}
