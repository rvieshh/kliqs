"use client";

import { useState, FormEvent } from "react";
import {
  Link2,
  Clipboard,
  Check,
  Loader2,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Footer } from "@/components/footer";

// ─────────────────────────────────────────────────────────────────────────────
// Landing Page — Kliqs.me
// s.id-inspired: warm off-white bg, clean full-width header, pill input
// with integrated CTA button, expansive single-column hero layout.
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
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      {/* ═══════════════════════════════════════════════════════════════════════
          HEADER — Full-width, clean bar with logo + nav + CTA
      ═══════════════════════════════════════════════════════════════════════ */}
      <header className="w-full border-b border-gray-200/60 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#635bff] flex items-center justify-center">
              <Link2 className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">
              Kliqs.me
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Shortener
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Analytics
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              QR Codes
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Microsite
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </a>
          </nav>

          {/* Auth CTA */}
          <div className="flex items-center gap-3">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-[#635bff] text-white text-sm font-semibold rounded-full hover:bg-[#5145e5] active:bg-[#4538d4] transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2.5 bg-[#635bff] text-white text-sm font-semibold rounded-full hover:bg-[#5145e5] active:bg-[#4538d4] transition-colors"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION — Expansive, single-column focused
      ═══════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 sm:py-28">
          <div className="w-full max-w-3xl mx-auto text-center">
            {/* Headline */}
            <h1 className="text-[2.75rem] sm:text-6xl lg:text-[4.25rem] font-black text-gray-900 leading-[1.08] tracking-tight mb-5">
              Short Links, Big Impact.
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-500 max-w-lg mx-auto mb-14 leading-relaxed">
              Shorten, share, and track your links with the simplest URL
              shortener on the web.
            </p>

            {/* ─────────────────────────────────────────────────────────────────
                URL INPUT — Pill-shaped container with integrated button
            ───────────────────────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
              <div className="flex items-center w-full bg-white rounded-full pl-6 pr-2 py-2 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)] focus-within:border-[#635bff]/50 focus-within:shadow-[0_2px_20px_rgba(99,91,255,0.08)] transition-all">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Paste your long URL here..."
                  className="flex-1 py-3 text-base text-gray-900 bg-transparent placeholder:text-gray-400 focus:outline-none min-w-0"
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 bg-[#635bff] text-white font-semibold text-sm rounded-full hover:bg-[#5145e5] active:bg-[#4538d4] disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer ml-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Shortening...
                    </>
                  ) : (
                    <>
                      Shorten URL
                      <ArrowRight className="w-4 h-4" />
                    </>
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
              <div className="mt-8 w-full max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-md border border-gray-100 animate-fade-in-up">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
                      Your short link
                    </p>
                    <a
                      href={result.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-bold text-[#635bff] hover:underline underline-offset-4 truncate block"
                    >
                      {result.shortUrl.replace("https://", "")}
                    </a>
                  </div>

                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer ${
                      isCopied
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "bg-[#635bff]/5 text-[#635bff] hover:bg-[#635bff]/10 border border-[#635bff]/10"
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
                Subtle trust tagline
            ───────────────────────────────────────────────────────────────── */}
            <p className="mt-12 text-sm text-gray-400 font-medium">
              Trusted by 10,000+ creators &amp; developers worldwide
            </p>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
