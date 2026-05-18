"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import {
  Link2,
  ExternalLink,
  Clipboard,
  Check,
  BarChart3,
  Calendar,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/navbar";

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Page — Protected
// Displays user's shortened links in a Stripe-inspired card layout.
// Redirects unauthenticated users to the login page.
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  async function handleCopy(slug: string, id: string) {
    const shortUrl = `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN || "kliqs.me"}/${slug}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = shortUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // Loading state while checking auth
  if (status === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center hero-gradient">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect via useEffect
  }

  const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "kliqs.me";

  return (
    <div className="flex-1 flex flex-col hero-gradient">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Your Links
          </h1>
          <p className="mt-2 text-muted">
            Manage and track all your shortened URLs in one place.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-card rounded-xl p-5 card-shadow border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                <Link2 className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {links.length}
                </p>
                <p className="text-xs text-muted">Total Links</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 card-shadow border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {links.reduce((sum, l) => sum + l.clicks, 0)}
                </p>
                <p className="text-xs text-muted">Total Clicks</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 card-shadow border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {links.length > 0 ? formatDate(links[0].createdAt) : "—"}
                </p>
                <p className="text-xs text-muted">Latest Link</p>
              </div>
            </div>
          </div>
        </div>

        {/* Links Table/Card List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          </div>
        ) : links.length === 0 ? (
          /* Empty State */
          <div className="bg-card rounded-2xl p-12 card-shadow border border-border/30 text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
              <Link2 className="w-7 h-7 text-accent" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No links yet
            </h2>
            <p className="text-muted text-sm mb-6 max-w-sm mx-auto">
              Shorten your first URL from the homepage and it will appear here.
            </p>
            <a
              href="https://home.kliqs.me"
              className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-white font-medium text-sm rounded-xl btn-lift"
            >
              <Link2 className="w-4 h-4" />
              Create your first link
            </a>
          </div>
        ) : (
          /* Links List */
          <div className="bg-card rounded-2xl card-shadow border border-border/30 overflow-hidden">
            {/* Table Header */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3 bg-gray-50/80 border-b border-border/50 text-xs font-medium uppercase tracking-wider text-muted">
              <div className="col-span-4">Short URL</div>
              <div className="col-span-4">Original URL</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-1 text-center">Clicks</div>
              <div className="col-span-1"></div>
            </div>

            {/* Link Rows */}
            {links.map((link, idx) => (
              <div
                key={link.id}
                className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors ${
                  idx !== links.length - 1 ? "border-b border-border/30" : ""
                }`}
              >
                {/* Short URL */}
                <div className="col-span-4 flex items-center gap-2 min-w-0">
                  <a
                    href={`https://${ROOT_DOMAIN}/${link.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-accent hover:underline underline-offset-4 truncate"
                  >
                    {ROOT_DOMAIN}/{link.slug}
                  </a>
                </div>

                {/* Original URL */}
                <div className="col-span-4 min-w-0">
                  <div className="flex items-center gap-1.5 text-sm text-muted truncate">
                    <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-60" />
                    <span className="truncate">{link.originalUrl}</span>
                  </div>
                </div>

                {/* Date */}
                <div className="col-span-2 text-sm text-muted">
                  {formatDate(link.createdAt)}
                </div>

                {/* Clicks */}
                <div className="col-span-1 text-center">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    <BarChart3 className="w-3 h-3 text-muted" />
                    {link.clicks}
                  </span>
                </div>

                {/* Copy Button */}
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => handleCopy(link.slug, link.id)}
                    className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                      copiedId === link.id
                        ? "bg-success/10 text-success"
                        : "bg-gray-100 text-muted hover:bg-accent/10 hover:text-accent"
                    }`}
                    title="Copy short URL"
                  >
                    {copiedId === link.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Clipboard className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
