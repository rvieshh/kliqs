"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useCallback, useRef } from "react";
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
  Download,
  Trash2,
  X,
  Check,
  AlertCircle,
  ScanLine,
  Maximize2,
  Upload,
  AlertTriangle,
  Type,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

// ─────────────────────────────────────────────────────────────────────────────
// QR Codes Page — Premium Branded QR Generator
// Split-view modal, contrast checking, logo support, multi-format download.
// ─────────────────────────────────────────────────────────────────────────────

interface QrCodeItem {
  id: string;
  title: string;
  destinationUrl: string;
  foregroundColor: string;
  backgroundColor: string;
  logoUrl: string | null;
  scans: number;
  createdAt: string;
}

interface Toast {
  type: "success" | "error";
  message: string;
}

// ─── Contrast Ratio Utility (WCAG 2.1) ─────────────────────────────────────
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(fg: string, bg: string): number {
  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);
  const l1 = relativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const l2 = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export default function QRCodesPage() {
  const { data: session, status } = useSession();
  const [qrCodes, setQrCodes] = useState<QrCodeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [previewModal, setPreviewModal] = useState<QrCodeItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const TEXT_LIMIT = 1500;

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") fetchQrCodes();
  }, [status]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 500ms debounce for live preview
  useEffect(() => {
    setIsPreviewLoading(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedValue(destinationUrl);
      setIsPreviewLoading(false);
    }, 500);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [destinationUrl]);

  // Handle logo file selection
  function handleLogoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  }

  function clearLogo() {
    setLogoFile(null);
    setLogoPreview("");
  }

  // Detect if input looks like a URL vs plain text
  function isLikelyUrl(text: string): boolean {
    return /^(https?:\/\/|www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/.test(text.trim());
  }

  const contrastRatio = getContrastRatio(fgColor, bgColor);
  const contrastOk = contrastRatio >= 4.5;

  async function fetchQrCodes() {
    try {
      const res = await fetch("/api/qr-codes");
      if (res.ok) {
        const data = await res.json();
        setQrCodes(data.qrCodes);
      }
    } catch (error) {
      console.error("Failed to fetch QR codes:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!contrastOk) {
      setToast({ type: "error", message: "Colors have insufficient contrast. Adjust to meet 4.5:1 ratio." });
      return;
    }
    if (destinationUrl.length > TEXT_LIMIT) {
      setToast({ type: "error", message: `Content exceeds ${TEXT_LIMIT} character limit.` });
      return;
    }
    setIsSubmitting(true);

    try {
      // Use FormData for file upload support
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("destinationUrl", destinationUrl.trim());
      formData.append("foregroundColor", fgColor);
      formData.append("backgroundColor", bgColor);
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const res = await fetch("/api/qr-codes", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ type: "error", message: data.error || "Failed to create QR code" });
        return;
      }

      setToast({ type: "success", message: `QR code "${data.title}" created!` });
      setShowModal(false);
      setTitle("");
      setDestinationUrl("");
      setFgColor("#000000");
      setBgColor("#FFFFFF");
      clearLogo();
      fetchQrCodes();
    } catch {
      setToast({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/qr-codes?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setQrCodes((prev) => prev.filter((q) => q.id !== id));
        setToast({ type: "success", message: "QR code deleted" });
      } else {
        const data = await res.json();
        setToast({ type: "error", message: data.error || "Failed to delete" });
      }
    } catch {
      setToast({ type: "error", message: "Network error" });
    }
  }

  function downloadSvg(id: string, title: string) {
    const svgEl = document.getElementById(`qr-${id}`);
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}-qr.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadPng(id: string, title: string) {
    const svgEl = document.getElementById(`qr-${id}`);
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new window.Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 1024, 1024);
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `${title.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc]">
        <Loader2 className="w-8 h-8 text-[#7c3aed] animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const gravatarHash = (session?.user as Record<string, unknown> | undefined)?.gravatarHash as string | undefined;
  const gravatarUrl = gravatarHash ? `https://www.gravatar.com/avatar/${gravatarHash}?d=retro&s=40` : null;
  const userName = session?.user?.name || "User";

  return (
    <div className="min-h-screen flex bg-[#f7f9fc]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${toast.type === "success" ? "bg-white border-emerald-200 text-emerald-700" : "bg-white border-red-200 text-red-700"}`}>
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 p-0.5 rounded hover:bg-gray-100 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 px-4 py-6 sticky top-0 h-screen">
        <div className="px-3 mb-8"><Image src="/logo.svg" alt="Kliqs.me" width={110} height={28} className="h-7 w-auto" /></div>
        <nav className="flex-1 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" />
          <SidebarItem icon={BarChart3} label="Analytics" href="#" />
          <SidebarItem icon={Link2} label="Links" href="/links" />
          <SidebarItem icon={QrCode} label="QR Codes" href="/qr-codes" active />
          <SidebarItem icon={User} label="Bio Page" href="/bio-page" />
          <SidebarItem icon={Settings} label="Settings" href="#" />
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2">
            {gravatarUrl ? <img src={gravatarUrl} alt={userName} className="w-9 h-9 rounded-xl ring-2 ring-gray-100" /> : <div className="w-9 h-9 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center"><span className="text-sm font-bold text-[#7c3aed]">{userName.charAt(0).toUpperCase()}</span></div>}
            <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">{userName}</p><p className="text-xs text-gray-400">Free Plan</p></div>
            <button onClick={() => signOut({ callbackUrl: "https://home.kliqs.me" })} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer" title="Sign out"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-[#f7f9fc]/80 backdrop-blur-sm border-b border-gray-100 px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div><h1 className="text-2xl font-bold text-gray-900 tracking-tight">QR Codes</h1><p className="text-sm text-gray-400 mt-0.5">Generate branded QR codes with logo support</p></div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-gray-600 hover:border-gray-200 transition-all cursor-pointer"><Bell className="w-4.5 h-4.5" /></button>
              <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] hover:shadow-lg hover:shadow-[#4361ee]/20 transition-all cursor-pointer"><Plus className="w-4 h-4" />Create QR Code</button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-[#7c3aed] animate-spin" /></div>
          ) : qrCodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center mb-6"><QrCode className="w-10 h-10 text-[#7c3aed]" /></div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No QR codes yet</h2>
              <p className="text-sm text-gray-400 mb-6 text-center max-w-sm">Create branded QR codes with custom colors, logos, and real-time scan tracking.</p>
              <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-3 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] hover:shadow-lg hover:shadow-[#4361ee]/20 transition-all cursor-pointer"><Plus className="w-4 h-4" />Generate Your First QR Code</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {qrCodes.map((qr) => (
                <div key={qr.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-center p-4 mb-4 rounded-lg bg-gray-50">
                    <QRCodeSVG id={`qr-${qr.id}`} value={qr.destinationUrl} size={120} fgColor={qr.foregroundColor} bgColor={qr.backgroundColor} level="H" imageSettings={qr.logoUrl ? { src: qr.logoUrl, height: 30, width: 30, excavate: true } : undefined} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{qr.title}</h3>
                  <p className="text-xs text-gray-400 truncate mb-3">{qr.destinationUrl}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500"><ScanLine className="w-3.5 h-3.5" /><span>{qr.scans} scans</span></div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setPreviewModal(qr)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#7c3aed] hover:bg-purple-50 transition-colors cursor-pointer" title="Preview"><Maximize2 className="w-4 h-4" /></button>
                      <button onClick={() => downloadSvg(qr.id, qr.title)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#7c3aed] hover:bg-purple-50 transition-colors cursor-pointer" title="Download SVG"><Download className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(qr.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          PREMIUM SPLIT-VIEW CREATE MODAL
      ═══════════════════════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Create Branded QR Code</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            {/* Split View */}
            <div className="flex flex-col md:flex-row">
              {/* Left: Controls */}
              <form onSubmit={handleCreate} className="flex-1 p-6 space-y-4 border-r border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., My Website QR" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all placeholder:text-gray-300" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Destination URL or Text</label>
                  <textarea value={destinationUrl} onChange={(e) => setDestinationUrl(e.target.value)} placeholder="example.com or any text content" required maxLength={TEXT_LIMIT} rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all placeholder:text-gray-300 resize-none" />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-400">
                      {isLikelyUrl(destinationUrl) ? "URL detected — https:// added if missing" : "Plain text mode"}
                    </p>
                    <span className={`text-xs ${destinationUrl.length > TEXT_LIMIT * 0.9 ? "text-amber-500" : "text-gray-400"}`}>{destinationUrl.length}/{TEXT_LIMIT}</span>
                  </div>
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Foreground</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                      <input type="text" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Background</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                      <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]" />
                    </div>
                  </div>
                </div>

                {/* Contrast Warning */}
                {!contrastOk && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <p className="text-xs text-amber-700">Low contrast ({contrastRatio.toFixed(1)}:1). Minimum 4.5:1 required for scannability.</p>
                  </div>
                )}

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Logo <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  {logoPreview ? (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50">
                      <img src={logoPreview} alt="Logo" className="w-8 h-8 rounded object-cover" />
                      <span className="text-sm text-gray-700 truncate flex-1">{logoFile?.name}</span>
                      <button type="button" onClick={clearLogo} className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-gray-300 hover:border-[#7c3aed] hover:bg-[#7c3aed]/5 transition-all cursor-pointer">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Upload logo image</span>
                      <input type="file" accept="image/*" onChange={handleLogoSelect} className="hidden" />
                    </label>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Centered in QR with Level H error correction</p>
                </div>

                <button type="submit" disabled={isSubmitting || !contrastOk} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {isSubmitting ? "Creating..." : "Generate QR Code"}
                </button>
              </form>

              {/* Right: Live Preview */}
              <div className="flex-1 p-6 flex flex-col items-center justify-center bg-gray-50/50 min-h-[400px]">
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Live Preview</p>
                  {isPreviewLoading && <Loader2 className="w-3 h-3 text-[#7c3aed] animate-spin" />}
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 relative">
                  {isPreviewLoading && (
                    <div className="absolute inset-0 bg-white/60 rounded-2xl flex items-center justify-center z-10">
                      <Loader2 className="w-5 h-5 text-[#7c3aed] animate-spin" />
                    </div>
                  )}
                  <QRCodeSVG
                    value={debouncedValue || "https://kliqs.me"}
                    size={180}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level="H"
                    imageSettings={logoPreview ? { src: logoPreview, height: 40, width: 40, excavate: true } : undefined}
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Contrast: <span className={contrastOk ? "text-emerald-600 font-semibold" : "text-red-500 font-semibold"}>{contrastRatio.toFixed(1)}:1</span>
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <p className="text-xs text-gray-400">Error correction: Level H (30%)</p>
                    {!isLikelyUrl(debouncedValue) && debouncedValue && (
                      <span className="inline-flex items-center gap-1 text-xs text-purple-500"><Type className="w-3 h-3" />Text</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          FULLSCREEN PREVIEW MODAL
      ═══════════════════════════════════════════════════════════════════════ */}
      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
            <button onClick={() => setPreviewModal(null)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{previewModal.title}</h3>
            <p className="text-xs text-gray-400 mb-6 truncate">{previewModal.destinationUrl}</p>
            <div className="flex justify-center mb-6">
              <QRCodeSVG id={`qr-preview-${previewModal.id}`} value={previewModal.destinationUrl} size={240} fgColor={previewModal.foregroundColor} bgColor={previewModal.backgroundColor} level="H" imageSettings={previewModal.logoUrl ? { src: previewModal.logoUrl, height: 50, width: 50, excavate: true } : undefined} />
            </div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => downloadSvg(previewModal.id, previewModal.title)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"><Download className="w-4 h-4" />SVG</button>
              <button onClick={() => downloadPng(`preview-${previewModal.id}`, previewModal.title)} className="flex items-center gap-2 px-4 py-2.5 bg-[#4361ee] text-white text-sm font-medium rounded-xl hover:bg-[#3a56d4] transition-colors cursor-pointer"><Download className="w-4 h-4" />PNG (1024px)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function SidebarItem({ icon: Icon, label, href, active = false }: { icon: React.ComponentType<{ className?: string }>; label: string; href: string; active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-[#7c3aed]/5 text-[#7c3aed]" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}>
      <Icon className="w-4.5 h-4.5" />{label}
    </Link>
  );
}
