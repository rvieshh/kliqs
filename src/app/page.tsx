"use client";

import { useState, FormEvent } from "react";
import {
  Link2,
  Clipboard,
  Check,
  Loader2,
  ExternalLink,
  BarChart3,
  Zap,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Footer } from "@/components/footer";

// ─────────────────────────────────────────────────────────────────────────────
// Landing Page — Kliqs.me
// s.id-inspired: clean, friendly, approachable with bold typography.
// Core focus: shorten links quickly and beautifully.
// ─────────────────────────────────────────────────────────────────────────────

interface ShortenedLink {
  id: string;
  slug: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export default function HomePage() {
  const { data: session } = useSession();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ShortenedLink | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsCopied(false);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("Please enter a URL.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setResult(data);
      setUrl("");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = result.shortUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Link2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">
              Kliqs
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col bg-white">
        <section className="w-full max-w-4xl mx-auto px-6 pt-36 pb-20 text-center">
          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight mb-6">
            Shorten your links,
            <br />
            <span className="text-blue-600">amplify your reach.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto mb-12 leading-relaxed font-medium">
            Create short, memorable links in seconds. Track clicks and share
            everywhere. Free, fast, and simple.
          </p>

          {/* ─────────────────────────────────────────────────────────────────
              URL Input (Pill-shaped, s.id style)
          ───────────────────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="flex items-center w-full bg-gray-50 rounded-full p-1.5 border-2 border-gray-200 focus-within:border-blue-500 transition-colors shadow-sm">
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Paste your long URL here..."
                className="flex-1 px-6 py-4 text-base text-gray-900 bg-transparent rounded-full placeholder:text-gray-400 focus:outline-none"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="submit"
                disabled={isLoading}
                className="flex-shrink-0 px-7 py-4 bg-blue-600 text-white font-bold text-base rounded-full hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Wait...
                  </span>
                ) : (
                  "Shorten"
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 text-sm text-red-500 font-medium animate-fade-in-up">
                {error}
              </div>
            )}
          </form>

          {/* ─────────────────────────────────────────────────────────────────
              Result Card
          ───────────────────────────────────────────────────────────────── */}
          {result && (
            <div className="mt-8 w-full max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-fade-in-up">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    Your short link
                  </p>
                  <a
                    href={result.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-bold text-blue-600 hover:underline underline-offset-4 truncate block"
                  >
                    {result.shortUrl.replace("https://", "")}
                  </a>
                </div>

                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer ${
                    isCopied
                      ? "bg-green-50 text-green-600 border border-green-200"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{result.originalUrl}</span>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              Trust line
          ───────────────────────────────────────────────────────────────── */}
          <p className="mt-10 text-sm text-gray-400 font-medium">
            Free forever &middot; No signup required &middot; Instant redirects
          </p>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            FEATURES (Simple, 3-column)
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="w-full bg-gray-50/70 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-4">
              Why Kliqs?
            </h2>
            <p className="text-base text-gray-500 text-center mb-14 max-w-lg mx-auto">
              Simple tools that help you share smarter.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Lightning Fast
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Sub-50ms redirects powered by edge infrastructure. Your links
                  are always instant.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Click Analytics
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  See how your links perform with real-time click tracking and
                  simple stats.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Secure & Reliable
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Every link is safe and always available. Built with privacy and
                  trust in mind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
