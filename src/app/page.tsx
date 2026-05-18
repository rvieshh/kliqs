"use client";

import { useState, FormEvent } from "react";
import {
  Link2,
  Clipboard,
  Check,
  Loader2,
  ExternalLink,
  BarChart3,
  Pencil,
  Zap,
  Globe,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Footer } from "@/components/footer";

// ─────────────────────────────────────────────────────────────────────────────
// Landing Page — Kliqs.me
// Enterprise SaaS aesthetic with glassmorphism navbar, hero with grid pattern,
// text gradient, social proof, and bento feature grid.
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
          GLASSMORPHISM NAVBAR (Fixed)
      ═══════════════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-sm">
              <Link2 className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight group-hover:text-accent transition-colors">
              Kliqs.me
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg btn-lift"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg btn-lift"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col">
        <section className="relative hero-gradient">
          {/* Dot Grid Background Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

          <div className="relative z-10 w-full max-w-3xl mx-auto px-6 pt-36 pb-24 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/5 border border-accent/10 text-xs font-medium text-accent mb-8 animate-fade-in">
              <Zap className="w-3 h-3" />
              Lightning-fast URL shortener
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-6">
              Shorten any URL
              <br />
              <span className="text-gradient-accent">in one click.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-muted max-w-xl mx-auto mb-14 leading-relaxed">
              The modern link shortener for developers and teams. Create clean,
              trackable short URLs with powerful analytics. No signup required.
            </p>

            {/* ─────────────────────────────────────────────────────────────────
                URL Input Form
            ───────────────────────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
              <div className="relative flex items-center gap-3 w-full bg-card rounded-2xl p-2 card-shadow-lg border border-border/50">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="https://your-very-long-url.com/paste-here"
                  className="flex-1 px-5 py-4 text-base text-foreground bg-transparent rounded-xl placeholder:text-muted/50 input-focus border border-transparent focus:border-accent/20"
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-shrink-0 px-6 py-4 bg-accent text-white font-semibold text-base rounded-xl btn-lift disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Shortening...
                    </span>
                  ) : (
                    "Shorten URL"
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
              <div className="mt-8 w-full max-w-2xl mx-auto bg-card rounded-2xl p-6 card-shadow-lg border border-border/30 animate-fade-in-up">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs uppercase tracking-wider text-muted font-medium mb-1">
                      Your short link
                    </p>
                    <a
                      href={result.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-bold text-accent hover:underline underline-offset-4 truncate block"
                    >
                      {result.shortUrl.replace("https://", "")}
                    </a>
                  </div>

                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                      isCopied
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-accent/5 text-accent hover:bg-accent/10 border border-accent/10"
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

                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{result.originalUrl}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────────
                Social Proof
            ───────────────────────────────────────────────────────────────── */}
            <div className="mt-16 animate-fade-in">
              <p className="text-sm text-muted/60 font-medium mb-6">
                Trusted by modern teams and developers worldwide
              </p>
              <div className="flex items-center justify-center gap-8 sm:gap-12 opacity-30">
                <Globe className="w-7 h-7 text-muted" />
                <Shield className="w-7 h-7 text-muted" />
                <Users className="w-7 h-7 text-muted" />
                <BarChart3 className="w-7 h-7 text-muted" />
                <Zap className="w-7 h-7 text-muted" />
                <Link2 className="w-7 h-7 text-muted" />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            FEATURE GRID (Bento Box)
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="w-full max-w-5xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Everything you need to manage links
            </h2>
            <p className="text-lg text-muted max-w-lg mx-auto">
              Powerful features built for speed, simplicity, and scale.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Feature 1: Advanced Analytics */}
            <div className="bg-card rounded-2xl p-7 card-shadow border border-border/40 bento-card animate-fade-in-up delay-100">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Advanced Analytics
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Track clicks, geographic data, referrers, and devices. Get
                real-time insights into how your links perform.
              </p>
            </div>

            {/* Feature 2: Custom Slugs */}
            <div className="bg-card rounded-2xl p-7 card-shadow border border-border/40 bento-card animate-fade-in-up delay-200">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-5">
                <Pencil className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Custom Slugs
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Create memorable, branded short links with custom back-halves.
                Make every link uniquely yours.
              </p>
            </div>

            {/* Feature 3: Fast Redirects */}
            <div className="bg-card rounded-2xl p-7 card-shadow border border-border/40 bento-card animate-fade-in-up delay-300">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-5">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Fast Redirects
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Edge-optimized infrastructure delivers sub-50ms redirects
                globally. Your users never wait.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            CTA Section
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="w-full max-w-5xl mx-auto px-6 pb-24">
          <div className="relative bg-card rounded-3xl p-12 sm:p-16 card-shadow-lg border border-border/30 text-center overflow-hidden">
            {/* Subtle background accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent pointer-events-none rounded-3xl" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
                Ready to shorten your links?
              </h2>
              <p className="text-lg text-muted max-w-md mx-auto mb-8">
                Join thousands of developers using Kliqs.me. Free forever for
                individual use.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/login"
                  className="px-6 py-3 bg-accent text-white font-semibold text-base rounded-xl btn-lift"
                >
                  Get Started Free
                </Link>
                <a
                  href="#"
                  className="px-6 py-3 bg-white text-foreground font-medium text-base rounded-xl border border-border hover:border-accent/30 transition-colors"
                >
                  View Documentation
                </a>
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
