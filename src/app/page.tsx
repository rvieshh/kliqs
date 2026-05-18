"use client";

import { useState, FormEvent } from "react";
import { Link2, Clipboard, Check, Loader2, ExternalLink } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Landing Page — Kliqs.me
// Stripe-inspired light mode with hero section, URL input, and result card.
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
      // Fallback for older browsers
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
    <main className="flex-1 flex flex-col items-center justify-center hero-gradient">
      {/* ─────────────────────────────────────────────────────────────────────
          Hero Section
      ───────────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 w-full max-w-2xl mx-auto px-6 py-24 text-center">
        {/* Logo / Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">
            Kliqs.me
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight tracking-tight mb-4">
          Shorten any URL
          <br />
          <span className="text-accent">in one click.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-muted max-w-md mx-auto mb-12 leading-relaxed">
          Paste your long link below and get a clean, fast short URL. No signup
          required.
        </p>

        {/* ─────────────────────────────────────────────────────────────────────
            URL Input Form
        ───────────────────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="w-full">
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

        {/* ─────────────────────────────────────────────────────────────────────
            Result Card
        ───────────────────────────────────────────────────────────────────── */}
        {result && (
          <div className="mt-8 w-full bg-card rounded-2xl p-6 card-shadow-lg border border-border/30 animate-fade-in-up">
            <div className="flex items-center justify-between gap-4">
              {/* Short URL Display */}
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

              {/* Copy Button */}
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

            {/* Original URL (truncated) */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-sm text-muted">
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{result.originalUrl}</span>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────
            Trust Indicators
        ───────────────────────────────────────────────────────────────────── */}
        <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted/70">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
            Fast redirects
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
            No signup needed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
            Click analytics
          </span>
        </div>
      </section>
    </main>
  );
}
