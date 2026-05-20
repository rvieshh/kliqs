"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Globe,
  Check,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Bio Page Builder — Edit profile, manage links, toggle publish status.
// ─────────────────────────────────────────────────────────────────────────────

interface BioLinkItem {
  id?: string;
  title: string;
  url: string;
  icon: string;
  order: number;
}

interface BioPageData {
  id: string;
  title: string;
  handle: string;
  displayName: string | null;
  description: string | null;
  avatarUrl: string | null;
  published: boolean;
  links: BioLinkItem[];
}

interface Toast {
  type: "success" | "error";
  message: string;
}

export default function BioPageBuilderPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  const [bioPage, setBioPage] = useState<BioPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [links, setLinks] = useState<BioLinkItem[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
  }, [status]);

  useEffect(() => {
    if (status === "authenticated" && pageId) fetchPage();
  }, [status, pageId]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  async function fetchPage() {
    try {
      const res = await fetch(`/api/bio-pages/${pageId}`);
      if (!res.ok) {
        setToast({ type: "error", message: "Bio page not found" });
        return;
      }
      const data = await res.json();
      const page = data.bioPage;
      setBioPage(page);
      setDisplayName(page.displayName || page.title || "");
      setDescription(page.description || "");
      setAvatarUrl(page.avatarUrl || "");
      setPublished(page.published);
      setLinks(page.links || []);
    } catch {
      setToast({ type: "error", message: "Failed to load bio page" });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/bio-pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          description,
          avatarUrl,
          published,
          links: links.map((l, i) => ({ title: l.title, url: l.url, icon: l.icon, order: i })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast({ type: "error", message: data.error || "Failed to save" });
        return;
      }
      setBioPage(data.bioPage);
      setLinks(data.bioPage.links || []);
      setToast({ type: "success", message: "Changes saved!" });
    } catch {
      setToast({ type: "error", message: "Network error" });
    } finally {
      setIsSaving(false);
    }
  }

  function addLink() {
    setLinks([...links, { title: "", url: "", icon: "globe", order: links.length }]);
  }

  function removeLink(index: number) {
    setLinks(links.filter((_, i) => i !== index));
  }

  function updateLink(index: number, field: keyof BioLinkItem, value: string) {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    setLinks(updated);
  }

  function moveLink(index: number, direction: "up" | "down") {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === links.length - 1) return;
    const updated = [...links];
    const target = direction === "up" ? index - 1 : index + 1;
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setLinks(updated);
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc]">
        <Loader2 className="w-8 h-8 text-[#4361ee] animate-spin" />
      </div>
    );
  }

  if (!bioPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc]">
        <p className="text-gray-500">Bio page not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${toast.type === "success" ? "bg-white border-emerald-200 text-emerald-700" : "bg-white border-red-200 text-red-700"}`}>
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 p-0.5 rounded hover:bg-gray-100 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/bio-page" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Edit: {bioPage.title}</h1>
              <p className="text-xs text-gray-400">{bioPage.handle}.kliqs.me</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Publish Toggle */}
            <button
              onClick={() => setPublished(!published)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${published ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-500 border border-gray-200"}`}
            >
              <span className={`w-2 h-2 rounded-full ${published ? "bg-emerald-500" : "bg-gray-400"}`} />
              {published ? "Published" : "Draft"}
            </button>
            {/* Save */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-8 space-y-6">
        {/* Profile Section */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="space-y-4">
            {/* Avatar URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Avatar URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://yoursite.com/avatar.jpg"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee] transition-all placeholder:text-gray-300"
              />
            </div>
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee] transition-all placeholder:text-gray-300"
              />
            </div>
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short bio about yourself..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee] transition-all placeholder:text-gray-300 resize-none"
              />
            </div>
          </div>
        </section>

        {/* Links Section */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Links</h2>
            <button
              onClick={addLink}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4361ee] bg-[#4361ee]/5 rounded-lg hover:bg-[#4361ee]/10 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Link
            </button>
          </div>

          {links.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No links yet. Add your first link above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((link, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                  {/* Reorder */}
                  <div className="flex flex-col gap-0.5 pt-2">
                    <button onClick={() => moveLink(index, "up")} className="p-0.5 text-gray-400 hover:text-gray-600 cursor-pointer" disabled={index === 0}>
                      <GripVertical className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Fields */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => updateLink(index, "title", e.target.value)}
                      placeholder="Link title"
                      className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee] placeholder:text-gray-300"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(index, "url", e.target.value)}
                      placeholder="https://example.com"
                      className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee] placeholder:text-gray-300"
                    />
                  </div>
                  {/* Delete */}
                  <button onClick={() => removeLink(index)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer mt-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Preview Link */}
        <div className="text-center">
          <a
            href={`https://${bioPage.handle}.kliqs.me`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#4361ee] hover:underline"
          >
            Preview: {bioPage.handle}.kliqs.me &rarr;
          </a>
        </div>
      </main>
    </div>
  );
}
