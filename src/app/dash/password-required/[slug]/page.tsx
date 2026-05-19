"use client";

import { useState } from "react";
import { Lock, ArrowRight, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { useParams } from "next/navigation";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// Password Required — Intermediary page for password-protected links
// User must enter the correct password to proceed to the destination URL.
// ─────────────────────────────────────────────────────────────────────────────

export default function PasswordRequiredPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      const res = await fetch("/api/links/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed");
        return;
      }

      // Redirect to destination
      window.location.href = data.destinationUrl;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc] px-4">
      <div className="max-w-sm w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          {/* Logo */}
          <div className="mb-6">
            <Image src="/logo.svg" alt="Kliqs.me" width={90} height={24} className="h-6 w-auto mx-auto" />
          </div>

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-[#4361ee]/5 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-8 h-8 text-[#4361ee]" />
          </div>

          {/* Title */}
          <h1 className="text-lg font-bold text-gray-900 mb-2">Password Required</h1>
          <p className="text-sm text-gray-400 mb-6">
            This link is protected. Enter the password to continue.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password"
                required
                autoFocus
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee] transition-all placeholder:text-gray-300"
              />
              <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center justify-center gap-2 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isVerifying || !password.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isVerifying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {isVerifying ? "Verifying..." : "Continue to Link"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-300 text-center mt-6">
          Short link: kliqs.me/{slug}
        </p>
      </div>
    </div>
  );
}
