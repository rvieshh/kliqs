"use client";

import { useState, useEffect } from "react";
import { Lock, ArrowRight, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// Password Required — Intermediary page for password-protected links
// Pre-checks if the link actually requires a password before rendering.
// - If link doesn't exist → redirects to /link-not-found
// - If link has no password → redirects to destination via standard resolver
// - If link has a password → renders the password input form
// ─────────────────────────────────────────────────────────────────────────────

export default function PasswordRequiredPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [linkValid, setLinkValid] = useState(false);

  // Pre-fetch: verify the link exists and actually has a password
  useEffect(() => {
    async function checkLink() {
      try {
        const res = await fetch("/api/links/verify-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, password: "" }),
        });

        if (res.status === 404) {
          // Link doesn't exist
          router.replace("/link-not-found");
          return;
        }

        if (res.status === 403) {
          // Password is wrong (empty string), meaning the link HAS a password → show form
          setLinkValid(true);
          setIsChecking(false);
          return;
        }

        if (res.status === 410) {
          // Link has expired
          router.replace("/link-expired");
          return;
        }

        if (res.ok) {
          // Empty password worked → link has no password, redirect to destination
          const data = await res.json();
          window.location.href = data.destinationUrl;
          return;
        }

        // Any other error — show the form as fallback
        setLinkValid(true);
        setIsChecking(false);
      } catch {
        // Network error — show form as fallback
        setLinkValid(true);
        setIsChecking(false);
      }
    }

    if (slug) {
      checkLink();
    }
  }, [slug, router]);

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

  // Loading state while checking link
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc]">
        <Loader2 className="w-8 h-8 text-[#4361ee] animate-spin" />
      </div>
    );
  }

  // Only render if the link is valid and password-protected
  if (!linkValid) {
    return null;
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
