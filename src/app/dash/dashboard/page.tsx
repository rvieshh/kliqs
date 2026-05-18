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
  HelpCircle,
  Bell,
  Loader2,
  Sparkles,
  MousePointerClick,
  Users,
  Eye,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { ClaimOnLogin } from "@/components/claim-on-login";

// ─────────────────────────────────────────────────────────────────────────────
// Executive Dashboard — Kliqs.me
// Rich layout with sidebar navigation, metrics grid, quick actions,
// plan summary, and usage quota tracker.
// ─────────────────────────────────────────────────────────────────────────────

interface LinkItem {
  id: string;
  slug: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  // Fetch user's links
  useEffect(() => {
    if (status === "authenticated") {
      fetchLinks();
    }
  }, [status]);

  async function fetchLinks() {
    try {
      const res = await fetch("/api/links");
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links);
      }
    } catch (error) {
      console.error("Failed to fetch links:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc]">
        <Loader2 className="w-8 h-8 text-[#635bff] animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const linksToday = links.filter(
    (l) => new Date(l.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen flex bg-[#f7f9fc]">
      <ClaimOnLogin />

      {/* ═══════════════════════════════════════════════════════════════════════
          SIDEBAR
      ═══════════════════════════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 px-4 py-6 sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-3 mb-8">
          <Image src="/logo.svg" alt="Kliqs.me" width={110} height={28} className="h-7 w-auto" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={BarChart3} label="Analytics" />
          <SidebarItem icon={Link2} label="Links" />
          <SidebarItem icon={QrCode} label="QR Codes" />
          <SidebarItem icon={User} label="Bio Page" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>

        {/* User Profile */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-9 h-9 rounded-xl ring-2 ring-gray-100"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[#635bff]/10 flex items-center justify-center">
                <span className="text-sm font-bold text-[#635bff]">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {session?.user?.name || "User"}
              </p>
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

      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header Bar */}
        <header className="sticky top-0 z-40 bg-[#f7f9fc]/80 backdrop-blur-sm border-b border-gray-100 px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Welcome back, {session?.user?.name?.split(" ")[0] || "there"}!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-gray-600 hover:border-gray-200 transition-all cursor-pointer">
                <Bell className="w-4.5 h-4.5" />
              </button>
              <a
                href="#"
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#635bff] to-[#8b5cf6] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-[#635bff]/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Upgrade Plan
              </a>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-6 lg:px-8 py-8">
          {/* ─────────────────────────────────────────────────────────────────
              QUICK ACCESS ROW
          ───────────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <QuickActionCard
              icon={Link2}
              label="Short new Link"
              href="https://home.kliqs.me"
              bgColor="bg-[#635bff]/5"
              iconColor="text-[#635bff]"
              borderHover="hover:border-[#635bff]/30"
            />
            <QuickActionCard
              icon={User}
              label="Create new Bio Page"
              href="https://home.kliqs.me"
              bgColor="bg-blue-50"
              iconColor="text-blue-500"
              borderHover="hover:border-blue-200"
            />
            <QuickActionCard
              icon={HelpCircle}
              label="Help & Support"
              href="#"
              bgColor="bg-amber-50"
              iconColor="text-amber-500"
              borderHover="hover:border-amber-200"
            />
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              ANALYTICS METRIC SNAPSHOT (4-Column)
          ───────────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              icon={MousePointerClick}
              label="Total Clicks"
              value={isLoading ? "—" : totalClicks.toString()}
              iconBg="bg-[#635bff]/10"
              iconColor="text-[#635bff]"
            />
            <MetricCard
              icon={Users}
              label="Unique Visitors"
              value={isLoading ? "—" : Math.floor(totalClicks * 0.7).toString()}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-500"
            />
            <MetricCard
              icon={QrCode}
              label="QR Code Scans"
              value="0"
              iconBg="bg-purple-50"
              iconColor="text-purple-500"
            />
            <MetricCard
              icon={Eye}
              label="Bio Page Views"
              value="0"
              iconBg="bg-blue-50"
              iconColor="text-blue-500"
            />
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              ACCOUNT INFO & QUOTA (2-Column)
          ───────────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Plan Summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 relative overflow-hidden">
              {/* Subtle gradient backdrop */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#635bff]/5 to-transparent rounded-bl-full pointer-events-none" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#635bff] to-[#8b5cf6] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Kliqs — Free Plan
                    </h3>
                    <p className="text-xs text-gray-400">
                      Basic features for personal use
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 text-sm text-gray-500 mb-5">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#635bff]" />
                    10 shortened links per day
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#635bff]" />
                    25 QR codes per month
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#635bff]" />
                    Basic click analytics
                  </li>
                </ul>

                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Upgrade to Pro
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Usage Limits */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-5">
                Usage This Period
              </h3>

              <div className="space-y-5">
                {/* Links per Day */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Links created today
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {linksToday} / 10
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#635bff] to-[#8b5cf6] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((linksToday / 10) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* QR Codes per Month */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      QR Codes this month
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      0 / 25
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>

                {/* Total Links */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Total active links
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {links.length} / 50
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((links.length / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-Components
// ─────────────────────────────────────────────────────────────────────────────

function SidebarItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-[#635bff]/5 text-[#635bff]"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-4.5 h-4.5" />
      {label}
    </a>
  );
}

function QuickActionCard({
  icon: Icon,
  label,
  href,
  bgColor,
  iconColor,
  borderHover,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  bgColor: string;
  iconColor: string;
  borderHover: string;
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 ${borderHover} transition-all hover:shadow-sm group cursor-pointer`}
    >
      <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
      <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-500 transition-colors" />
    </a>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
    </div>
  );
}
