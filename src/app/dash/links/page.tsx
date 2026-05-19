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
  Sparkles,
  LogOut,
  Plus,
  ExternalLink,
  Copy,
  Trash2,
  MousePointerClick,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Links Page — Kliqs.me Dashboard
// Displays all shortened links for the authenticated user with a clean,
// data-driven table and primary CTA for creating new links.
// ─────────────────────────────────────────────────────────────────────────────

interface LinkItem {
  id: string;
  slug: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
}

export default function LinksPage() {
  const { data: session, status } = useSession();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

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

  function copyToClipboard(slug: string) {
    navigator.clipboard.writeText(`https://kliqs.me/${slug}`);
  }

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
          <SidebarItem icon={Link2} label="Links" href="/links" active />
          <SidebarItem icon={QrCode} label="QR Codes" href="/qr-codes" />
          <SidebarItem icon={User} label="Bio Page" href="/bio-page" />
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
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Shortened Links</h1>
              <p className="text-sm text-gray-400 mt-0.5">Manage and track all your shortened URLs</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-gray-600 hover:border-gray-200 transition-all cursor-pointer">
                <Bell className="w-4.5 h-4.5" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] hover:shadow-lg hover:shadow-[#4361ee]/20 transition-all cursor-pointer">
                <Plus className="w-4 h-4" />
                Create New Link
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-[#4361ee] animate-spin" />
            </div>
          ) : links.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-[#4361ee]/5 flex items-center justify-center mb-6">
                <Link2 className="w-10 h-10 text-[#4361ee]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No links yet</h2>
              <p className="text-sm text-gray-400 mb-6 text-center max-w-sm">
                Create your first shortened link to start tracking clicks and sharing URLs effortlessly.
              </p>
              <button className="flex items-center gap-2 px-5 py-3 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] hover:shadow-lg hover:shadow-[#4361ee]/20 transition-all cursor-pointer">
                <Plus className="w-4 h-4" />
                Create Your First Link
              </button>
            </div>
          ) : (
            /* Links Table */
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Short URL</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Destination</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Clicks</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Created</th>
                      <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {links.map((link) => (
                      <tr key={link.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#4361ee]">kliqs.me/{link.slug}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 truncate max-w-[200px] block">{link.originalUrl}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <MousePointerClick className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{link.clicks}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm text-gray-500">{new Date(link.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => copyToClipboard(link.slug)} className="p-2 rounded-lg text-gray-400 hover:text-[#4361ee] hover:bg-[#4361ee]/5 transition-colors cursor-pointer" title="Copy link">
                              <Copy className="w-4 h-4" />
                            </button>
                            <a href={`https://kliqs.me/${link.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="Open link">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer" title="Delete link">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
