"use client";

import { useState, useRef, useCallback, useEffect, FormEvent } from "react";
import {
  Link2,
  Clipboard,
  Check,
  Loader2,
  ExternalLink,
  ArrowRight,
  QrCode,
  User,
  X,
  Download,
  AlertTriangle,
  BarChart3,
  Zap,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { Footer } from "@/components/footer";

// ─────────────────────────────────────────────────────────────────────────────
// Landing Page — Kliqs.me
// Professional SaaS with feature tabs (Shortener, QR, Bio Page),
// auth interceptor modal, floating pill header, rounded-xl corners.
// ─────────────────────────────────────────────────────────────────────────────

type FeatureTab = "shortener" | "qr" | "bio";

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
  const [activeTab, setActiveTab] = useState<FeatureTab>("shortener");
  const [url, setUrl] = useState("");
  const [qrInput, setQrInput] = useState("");
  const [activeQrValue, setActiveQrValue] = useState("");
  const [bioUsername, setBioUsername] = useState("");
  const [result, setResult] = useState<ShortenedLink | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  async function handleShortenSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsCopied(false);

    let trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("Please enter a URL.");
      return;
    }

    // Auto-prepend https:// if no protocol is provided
    if (!/^https?:\/\//i.test(trimmedUrl)) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://dash.kliqs.me/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmedUrl }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setResult(data);
      setUrl("");

      // Store link ID in localStorage for guest claiming later
      if (!session?.user) {
        const stored = localStorage.getItem("kliqs_anonymous_links");
        const ids: string[] = stored ? JSON.parse(stored) : [];
        ids.push(data.id);
        localStorage.setItem("kliqs_anonymous_links", JSON.stringify(ids));
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleBioSubmit(e: FormEvent) {
    e.preventDefault();
    if (!bioUsername.trim()) {
      setError("Please enter a username.");
      return;
    }
    // Open auth modal instead of API call
    setShowAuthModal(true);
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

  function handleTabChange(tab: FeatureTab) {
    setActiveTab(tab);
    setError(null);
    setResult(null);
    setActiveQrValue("");
  }

  // QR Code canvas ref for download
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownloadQr = useCallback(() => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `kliqs-qr-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fc]">
      {/* ═══════════════════════════════════════════════════════════════════════
          FLOATING PILL HEADER
      ═══════════════════════════════════════════════════════════════════════ */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
        <nav className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-xl px-6 py-3.5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Kliqs.me" width={120} height={32} className="h-8 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-7">
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Shortener
            </a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Analytics
            </a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              QR Codes
            </a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Microsite
            </a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-3">
            {session?.user ? (
              <a
                href="https://dash.kliqs.me/dashboard"
                className="px-5 py-2 bg-[#635bff] text-white text-sm font-semibold rounded-lg hover:bg-[#5145e5] active:bg-[#4538d4] transition-colors"
              >
                Dashboard
              </a>
            ) : (
              <>
                <a
                  href="https://dash.kliqs.me/login"
                  className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Log in
                </a>
                <a
                  href="https://dash.kliqs.me/login"
                  className="px-5 py-2 bg-[#635bff] text-white text-sm font-semibold rounded-lg hover:bg-[#5145e5] active:bg-[#4538d4] transition-colors"
                >
                  Sign Up Free
                </a>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex flex-col items-center justify-center px-6 pt-40 pb-20 sm:pt-48 sm:pb-28">
          <div className="w-full max-w-3xl mx-auto text-center">
            {/* Headline */}
            <h1 className="text-[2.75rem] sm:text-6xl lg:text-[4.25rem] font-black text-gray-900 leading-[1.08] tracking-tight mb-5">
              Short Links, Big Impact.
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-500 max-w-lg mx-auto mb-10 leading-relaxed">
              Shorten, share, and track your links with the simplest URL
              shortener on the web.
            </p>

            {/* ─────────────────────────────────────────────────────────────────
                FEATURE TABS
            ───────────────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-center gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit mx-auto">
              <button
                onClick={() => handleTabChange("shortener")}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === "shortener"
                    ? "bg-white text-[#635bff] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Link2 className="w-4 h-4" />
                Shortener
              </button>
              <button
                onClick={() => handleTabChange("qr")}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === "qr"
                    ? "bg-white text-[#635bff] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <QrCode className="w-4 h-4" />
                Kode QR
              </button>
              <button
                onClick={() => handleTabChange("bio")}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === "bio"
                    ? "bg-white text-[#635bff] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <User className="w-4 h-4" />
                Bio Page
              </button>
            </div>

            {/* ─────────────────────────────────────────────────────────────────
                DYNAMIC INPUT FORMS
            ───────────────────────────────────────────────────────────────── */}

            {/* === SHORTENER TAB === */}
            {activeTab === "shortener" && (
              <div className="animate-fade-in-up">
                <form onSubmit={handleShortenSubmit} className="w-full max-w-2xl mx-auto">
                  <div className="flex items-center w-full bg-white rounded-xl pl-5 pr-2 py-2 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)] focus-within:border-[#635bff]/40 focus-within:shadow-[0_2px_20px_rgba(99,91,255,0.08)] transition-all">
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
                      className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-[#635bff] text-white font-semibold text-sm rounded-lg hover:bg-[#5145e5] active:bg-[#4538d4] disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer ml-3"
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
                </form>
              </div>
            )}

            {/* === KODE QR TAB === */}
            {activeTab === "qr" && (
              <div className="animate-fade-in-up">
                <div className="w-full max-w-2xl mx-auto">
                  <div className="flex items-center w-full bg-white rounded-xl pl-5 pr-2 py-2 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)] focus-within:border-[#635bff]/40 focus-within:shadow-[0_2px_20px_rgba(99,91,255,0.08)] transition-all">
                    <input
                      type="text"
                      value={qrInput}
                      onChange={(e) => {
                        setQrInput(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Enter URL or text to generate QR Code..."
                      className="flex-1 py-3 text-base text-gray-900 bg-transparent placeholder:text-gray-400 focus:outline-none min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!qrInput.trim()) {
                          setError("Please enter a URL or text.");
                          return;
                        }
                        setError(null);
                        setActiveQrValue(qrInput.trim());
                      }}
                      className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-[#635bff] text-white font-semibold text-sm rounded-lg hover:bg-[#5145e5] active:bg-[#4538d4] transition-colors cursor-pointer ml-3"
                    >
                      <QrCode className="w-4 h-4" />
                      Buat QR Code
                    </button>
                  </div>

                  {/* QR Code Render (only after button click) */}
                  {activeQrValue && (
                    <div className="mt-8 flex flex-col items-center gap-5 animate-fade-in-up">
                      <div
                        ref={qrRef}
                        className="bg-white p-6 rounded-xl border border-gray-100 shadow-md inline-block"
                      >
                        <QRCodeCanvas
                          value={activeQrValue}
                          size={200}
                          bgColor="#ffffff"
                          fgColor="#1a1a2e"
                          level="H"
                          includeMargin={false}
                        />
                      </div>
                      <button
                        onClick={handleDownloadQr}
                        className="flex items-center gap-2 px-5 py-3 bg-[#635bff] text-white font-semibold text-sm rounded-lg hover:bg-[#5145e5] active:bg-[#4538d4] transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        Download QR
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* === BIO PAGE TAB === */}
            {activeTab === "bio" && (
              <div className="animate-fade-in-up">
                <form onSubmit={handleBioSubmit} className="w-full max-w-2xl mx-auto">
                  <div className="flex items-center w-full bg-white rounded-xl pl-5 pr-2 py-2 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)] focus-within:border-[#635bff]/40 focus-within:shadow-[0_2px_20px_rgba(99,91,255,0.08)] transition-all">
                    <input
                      type="text"
                      value={bioUsername}
                      onChange={(e) => {
                        setBioUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                        if (error) setError(null);
                      }}
                      placeholder="yourname"
                      className="flex-1 py-3 text-base text-gray-900 bg-transparent placeholder:text-gray-400 focus:outline-none min-w-0"
                    />
                    <span className="text-sm font-medium text-gray-400 mr-3 select-none">
                      .kliqs.me
                    </span>
                    <button
                      type="submit"
                      className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-[#635bff] text-white font-semibold text-sm rounded-lg hover:bg-[#5145e5] active:bg-[#4538d4] transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      Buat Bio Page
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 text-sm text-red-500 font-medium animate-fade-in-up">
                {error}
              </div>
            )}

            {/* Guest Expiration Warning */}
            {!session?.user && (result || activeQrValue) && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5 max-w-2xl mx-auto animate-fade-in-up">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>
                  Link / QR Code ini bersifat sementara dan akan dihapus dalam 24 jam.{" "}
                  <a href="https://dash.kliqs.me/login" className="font-semibold underline underline-offset-2 hover:text-amber-700">
                    Daftar atau Login sekarang
                  </a>{" "}
                  agar permanen!
                </span>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────────
                Result Card (Shortener only)
            ───────────────────────────────────────────────────────────────── */}
            {result && activeTab === "shortener" && (
              <div className="mt-8 w-full max-w-2xl mx-auto bg-white rounded-xl p-6 shadow-md border border-gray-100 animate-fade-in-up">
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
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer ${
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

            {/* Trust tagline */}
            <p className="mt-12 text-sm text-gray-400 font-medium">
              Trusted by 10,000+ creators &amp; developers worldwide
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            SECTION: PLATFORM FEATURES
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="w-full px-6 md:px-12 py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-3">
              Built for Speed & Scale
            </h2>
            <p className="text-base text-gray-500 text-center mb-12 max-w-lg mx-auto">
              Everything you need to manage, track, and grow your online presence.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <FeatureCard
                icon={<BarChart3 className="w-6 h-6 text-[#635bff]" />}
                title="Real-time Analytics"
                description="Track clicks, geographic data, and referrers as they happen."
              />
              <FeatureCard
                icon={<User className="w-6 h-6 text-[#635bff]" />}
                title="Secure Bio Pages"
                description="Create beautiful personal landing pages with SSL protection."
              />
              <FeatureCard
                icon={<QrCode className="w-6 h-6 text-[#635bff]" />}
                title="Custom QR Styles"
                description="Generate branded QR codes with custom colors and logos."
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6 text-[#635bff]" />}
                title="Global Edge Delivery"
                description="Sub-50ms redirects powered by worldwide edge infrastructure."
              />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            SECTION: PRICING PLANS
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="w-full px-6 md:px-12 py-20 bg-[#f7f9fc]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base text-gray-500 text-center mb-12 max-w-lg mx-auto">
              Start free. Upgrade when you need more power.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <PricingCard
                name="Free"
                price="Rp0"
                period="/bln"
                features={["5 short links/day", "5 QR codes/month", "Basic analytics", "Community support"]}
              />
              <PricingCard
                name="Pro"
                price="Rp15.000"
                period="/bln"
                popular
                features={["Unlimited links", "Custom Bio Page", "Full analytics", "Priority support"]}
              />
              <PricingCard
                name="Elite"
                price="Rp20.000"
                period="/bln"
                features={["Everything in Pro", "API access", "Custom domains", "Team collaboration"]}
              />
              <PricingCard
                name="Platinum"
                price="Rp25.000"
                period="/bln"
                features={["White-label", "Priority 24/7", "Unlimited everything", "SLA guarantee"]}
              />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            SECTION: SPONSORS (Paymenter Style - Light Mode)
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="w-full px-6 md:px-12 py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            {/* Split Intro Row */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-12">
              <div className="lg:max-w-md">
                <p className="text-xs font-bold uppercase tracking-widest text-[#635bff] mb-3">
                  SPONSORS
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                  Building Together a Sustainable Future for Kliqs
                </h2>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed lg:max-w-sm lg:pt-8">
                Our sponsors help us keep Kliqs free and accessible for everyone. 
                Their support enables us to maintain edge infrastructure and deliver 
                the fastest URL shortener experience.
              </p>
            </div>

            {/* Sponsor Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {/* Sponsor 1: MarketKu */}
              <a
                href="https://marketku.id"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center p-10 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-purple-500 hover:bg-white transition-all duration-300 hover:shadow-md cursor-pointer"
              >
                <div className="transition-transform duration-300 group-hover:-translate-y-2">
                  <img
                    src="/marketku.png"
                    alt="MarketKu"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <span className="absolute bottom-5 text-xs font-semibold text-gray-500 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  MarketKu
                </span>
              </a>

              {/* Sponsor 2: Placeholder */}
              <a
                href="#"
                className="group relative flex flex-col items-center justify-center p-10 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-purple-500 hover:bg-white transition-all duration-300 hover:shadow-md cursor-pointer"
              >
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-2">
                  <span className="text-xl font-bold text-gray-300 group-hover:text-[#635bff] transition-colors duration-300">C</span>
                </div>
                <span className="absolute bottom-5 text-xs font-semibold text-gray-500 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  CloudBase
                </span>
              </a>

              {/* Sponsor 3: Placeholder */}
              <a
                href="#"
                className="group relative flex flex-col items-center justify-center p-10 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-purple-500 hover:bg-white transition-all duration-300 hover:shadow-md cursor-pointer"
              >
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-2">
                  <span className="text-xl font-bold text-gray-300 group-hover:text-[#635bff] transition-colors duration-300">D</span>
                </div>
                <span className="absolute bottom-5 text-xs font-semibold text-gray-500 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  DevStack
                </span>
              </a>

              {/* CTA: Become a Sponsor */}
              <a
                href="#"
                className="group flex flex-col items-center justify-center p-10 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/30 hover:border-[#635bff]/40 hover:bg-[#635bff]/[0.02] transition-all duration-300 cursor-pointer"
              >
                <span className="text-sm font-semibold text-gray-500 group-hover:text-[#635bff] transition-colors">
                  Become a Sponsor ↗
                </span>
                <span className="text-xs text-gray-400 mt-1.5">
                  (Get visibility/mo)
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          AUTH INTERCEPTOR MODAL (Bio Page)
      ═══════════════════════════════════════════════════════════════════════ */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setShowAuthModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl p-8 sm:p-10 w-full max-w-md shadow-2xl border border-gray-100 animate-fade-in-up">
            {/* Close button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="text-center">
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-[#635bff]/10 flex items-center justify-center mx-auto mb-5">
                <User className="w-7 h-7 text-[#635bff]" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Satu langkah lagi!
              </h2>
              <p className="text-base text-gray-500 mb-8 leading-relaxed">
                Login atau daftar akun Kliqs dulu yuk untuk mengklaim subdomain{" "}
                <span className="font-semibold text-[#635bff]">
                  {bioUsername || "yourname"}.kliqs.me
                </span>
              </p>

              {/* OAuth Buttons */}
              <div className="space-y-3">
                {/* Google */}
                <button
                  onClick={() => signIn("google", { callbackUrl: "https://dash.kliqs.me/dashboard" })}
                  className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white border border-gray-200 rounded-xl font-medium text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Masuk dengan Google
                </button>

                {/* GitHub */}
                <button
                  onClick={() => signIn("github", { callbackUrl: "https://dash.kliqs.me/dashboard" })}
                  className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-[#24292f] border border-[#24292f] rounded-xl font-medium text-sm text-white hover:bg-[#32383f] transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  Masuk dengan GitHub
                </button>
              </div>

              <p className="mt-6 text-xs text-gray-400">
                Dengan masuk, kamu setuju dengan{" "}
                <a href="#" className="underline hover:text-gray-600">Ketentuan Layanan</a>
                {" "}kami.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Sub-Components for Sections
// ─────────────────────────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group bg-white rounded-2xl p-8 border border-gray-100 transition-all duration-300 ease-out hover:scale-[0.98] hover:shadow-[0_0_30px_rgba(99,91,255,0.15)] hover:border-purple-200 cursor-pointer">
      <div className="w-12 h-12 rounded-xl bg-[#f7f9fc] border border-gray-100 flex items-center justify-center mb-4 shadow-sm transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105">
        {icon}
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1.5">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  features,
  popular = false,
}: {
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}) {
  return (
    <div
      className={`relative bg-white rounded-2xl p-6 border transition-all hover:shadow-md ${
        popular
          ? "border-[#635bff] shadow-sm ring-1 ring-[#635bff]/10"
          : "border-gray-100 hover:border-gray-200"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#635bff] text-white text-xs font-bold rounded-full">
          Most Popular
        </div>
      )}

      <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>
      <div className="flex items-baseline gap-1 mb-5">
        <span className="text-2xl font-extrabold text-gray-900">{price}</span>
        <span className="text-sm text-gray-400">{period}</span>
      </div>

      <ul className="space-y-2.5 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#635bff] flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <a
        href="https://dash.kliqs.me/login"
        className={`block w-full text-center py-2.5 text-sm font-semibold rounded-xl transition-colors ${
          popular
            ? "bg-[#635bff] text-white hover:bg-[#5145e5]"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {price === "Rp0" ? "Get Started" : "Subscribe"}
      </a>
    </div>
  );
}

// (End of file)
