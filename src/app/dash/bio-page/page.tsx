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
  Globe,
  Trash2,
  Eye,
  X,
  Check,
  AlertCircle,
  ExternalLink,
  Pencil,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Bio Pages — Kliqs.me Dashboard
// Fully functional: create, list, delete bio pages with status indicators.
// ─────────────────────────────────────────────────────────────────────────────

interface BioPageItem {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  published: boolean;
  views: number;
  createdAt: string;
}

interface Toast {
  type: "success" | "error";
  message: string;
}

export default function BioPagePage() {
  const { data: session, status } = useSession();
  const [bioPages, setBioPages] = useState<BioPageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [handle, setHandle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchBioPages();
    }
  }, [status]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  async function fetchBioPages() {
    try {
      const res = await fetch("/api/bio-pages");
      if (res.ok) {
        const data = await res.json();
        setBioPages(data.bioPages);
      }
    } catch (error) {
      console.error("Failed to fetch bio pages:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/bio-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          handle: handle.trim().toLowerCase(),
          description: description.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ type: "error", message: data.error || "Failed to create bio page" });
        return;
      }

      setToast({ type: "success", message: `Bio page "${data.title}" created!` });
      setShowModal(false);
      setTitle("");
      setHandle("");
      setDescription("");
      fetchBioPages();
    } catch {
      setToast({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/bio-pages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setBioPages((prev) => prev.filter((p) => p.id !== id));
        setToast({ type: "success", message: "Bio page deleted" });
      } else {
        const data = await res.json();
        setToast({ type: "error", message: data.error || "Failed to delete" });
      }
    } catch {
      setToast({ type: "error", message: "Network error" });
    }
  }

  // Auto-generate handle from title
  function handleTitleChange(value: string) {
    setTitle(value);
    if (!handle || handle === slugify(title)) {
      setHandle(slugify(value));
    }
  }

  function slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 30);
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
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
          toast.type === "success" ? "bg-white border-emerald-200 text-emerald-700" : "bg-white border-red-200 text-red-700"
        }`}>
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

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
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
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] hover:shadow-lg hover:shadow-[#4361ee]/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create Bio Page
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-[#4361ee] animate-spin" />
            </div>
          ) : bioPages.length === 0 ? (
            /* Empty State */
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#03ab0e]/5 to-transparent rounded-bl-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#4361ee]/5 to-transparent rounded-tr-full pointer-events-none" />

                <div className="relative text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4361ee]/10 to-[#03ab0e]/10 flex items-center justify-center mx-auto mb-6">
                    <User className="w-10 h-10 text-[#4361ee]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Create your Bio Page</h2>
                  <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">
                    Build a beautiful, customizable landing page that houses all your important links in one place.
                  </p>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#03ab0e]/5 rounded-full mb-8">
                    <span className="w-2 h-2 rounded-full bg-[#03ab0e] animate-pulse" />
                    <span className="text-xs font-medium text-[#03ab0e]">Ready to publish</span>
                  </div>

                  <div className="block">
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex items-center gap-2 px-5 py-3 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] hover:shadow-lg hover:shadow-[#4361ee]/20 transition-all cursor-pointer mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Create Your First Bio Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Bio Pages List */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {bioPages.map((page) => (
                <div key={page.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow relative overflow-hidden group">
                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      page.published
                        ? "bg-[#03ab0e]/5 text-[#03ab0e]"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${page.published ? "bg-[#03ab0e]" : "bg-gray-400"}`} />
                      {page.published ? "Published" : "Draft"}
                    </div>
                  </div>

                  {/* Clickable area */}
                  <Link href={`/bio-page/${page.id}`} className="block">
                    {/* Page icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4361ee]/10 to-[#03ab0e]/10 flex items-center justify-center mb-4">
                      <Globe className="w-6 h-6 text-[#4361ee]" />
                    </div>

                    {/* Info */}
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{page.title}</h3>
                    <p className="text-xs text-[#4361ee] font-medium mb-1">{page.handle}.kliqs.me</p>
                    {page.description && (
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{page.description}</p>
                    )}
                  </Link>

                  {/* Stats & Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{page.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link href={`/bio-page/${page.id}`} className="p-1.5 rounded-lg text-gray-400 hover:text-[#4361ee] hover:bg-[#4361ee]/5 transition-colors" title="Edit page">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <a href={`https://${page.handle}.kliqs.me`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-gray-400 hover:text-[#4361ee] hover:bg-[#4361ee]/5 transition-colors" title="View page">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button onClick={(e) => { e.preventDefault(); handleDelete(page.id); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          CREATE BIO PAGE MODAL
      ═══════════════════════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Create Bio Page</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Page Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., My Personal Page"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee] transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Handle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subdomain (your URL)</label>
                <div className="flex items-center gap-0 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#4361ee]/20 focus-within:border-[#4361ee] transition-all overflow-hidden">
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                    placeholder="yourname"
                    required
                    className="flex-1 px-3 py-3 text-sm focus:outline-none placeholder:text-gray-300"
                  />
                  <span className="px-3 py-3 bg-gray-50 text-sm text-gray-400 border-l border-gray-200 whitespace-nowrap">.kliqs.me</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">3-30 characters: lowercase letters, numbers, hyphens, underscores</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A short bio about you..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee] transition-all placeholder:text-gray-300 resize-none"
                />
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
                {isSubmitting ? "Creating..." : "Create Bio Page"}
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
