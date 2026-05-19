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
  ExternalLink,
  Copy,
  Trash2,
  MousePointerClick,
  Calendar,
  X,
  Check,
  AlertCircle,
  Lock,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Links Page — Kliqs.me Dashboard
// Fully functional: create, list, copy, delete shortened links.
// ─────────────────────────────────────────────────────────────────────────────

interface LinkItem {
  id: string;
  slug: string;
  originalUrl: string;
  clicks: number;
  expiresAt: string | null;
  hasPassword: boolean;
  createdAt: string;
}

interface Toast {
  type: "success" | "error";
  message: string;
}

export default function LinksPage() {
  const { data: session, status } = useSession();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Form state
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiration, setExpiration] = useState("7d");
  const [password, setPassword] = useState("");

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

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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

  async function handleCreateLink(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          customAlias: customAlias.trim() || undefined,
          expiration,
          password: password.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ type: "error", message: data.error || "Failed to create link" });
        return;
      }

      setToast({ type: "success", message: `Link created: kliqs.me/${data.slug}` });
      setShowModal(false);
      setUrl("");
      setCustomAlias("");
      setExpiration("7d");
      setPassword("");
      fetchLinks(); // Refresh list
    } catch {
      setToast({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/links?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLinks((prev) => prev.filter((l) => l.id !== id));
        setToast({ type: "success", message: "Link deleted successfully" });
      } else {
        const data = await res.json();
        setToast({ type: "error", message: data.error || "Failed to delete" });
      }
    } catch {
      setToast({ type: "error", message: "Network error" });
    }
  }

  function copyToClipboard(slug: string) {
    navigator.clipboard.writeText(`https://kliqs.me/${slug}`);
    setToast({ type: "success", message: "Copied to clipboard!" });
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
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
          toast.type === "success"
            ? "bg-white border-emerald-200 text-emerald-700"
            : "bg-white border-red-200 text-red-700"
        } animate-in slide-in-from-top-2`}>
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 p-0.5 rounded hover:bg-gray-100 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] hover:shadow-lg hover:shadow-[#4361ee]/20 transition-all cursor-pointer"
              >
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
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-[#4361ee]/5 flex items-center justify-center mb-6">
                <Link2 className="w-10 h-10 text-[#4361ee]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No links yet</h2>
              <p className="text-sm text-gray-400 mb-6 text-center max-w-sm">
                Create your first shortened link to start tracking clicks and sharing URLs effortlessly.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-5 py-3 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] hover:shadow-lg hover:shadow-[#4361ee]/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create Your First Link
              </button>
            </div>
          ) : (
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
                            {link.hasPassword && <span title="Password protected"><Lock className="w-3 h-3 text-amber-500" /></span>}
                            {link.expiresAt && <span title={`Expires ${new Date(link.expiresAt).toLocaleDateString()}`}><Clock className="w-3 h-3 text-gray-400" /></span>}
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
                            <button onClick={() => handleDelete(link.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer" title="Delete link">
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

      {/* ═══════════════════════════════════════════════════════════════════════
          CREATE LINK MODAL
      ═══════════════════════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Create New Link</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLink} className="space-y-4">
              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Destination URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="example.com/your-long-url"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee] transition-all placeholder:text-gray-300"
                />
                <p className="text-xs text-gray-400 mt-1">https:// will be added automatically if missing</p>
              </div>

              {/* Custom Alias */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Custom Alias <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-0 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#4361ee]/20 focus-within:border-[#4361ee] transition-all overflow-hidden">
                  <span className="px-3 py-3 bg-gray-50 text-sm text-gray-400 border-r border-gray-200 whitespace-nowrap">kliqs.me/</span>
                  <input
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    placeholder="my-custom-link"
                    className="flex-1 px-3 py-3 text-sm focus:outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* Expiration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiration</label>
                <select
                  value={expiration}
                  onChange={(e) => setExpiration(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee] transition-all bg-white appearance-none cursor-pointer"
                >
                  <option value="1d">1 Day</option>
                  <option value="7d">7 Days (Default)</option>
                  <option value="14d">14 Days</option>
                  <option value="30d">30 Days</option>
                  <option value="never">No Expiration</option>
                </select>
              </div>

              {/* Password Protection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password Protection <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave empty for no protection"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee] transition-all placeholder:text-gray-300"
                />
                <p className="text-xs text-gray-400 mt-1">Visitors must enter this password to access the link</p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isSubmitting ? "Creating..." : "Create Short Link"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

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
