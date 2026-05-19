"use client";

import { Clock, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Link Expired — Shown when a time-limited link has passed its expiration
// ─────────────────────────────────────────────────────────────────────────────

export default function LinkExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc] px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-amber-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Link Expired</h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          This short link has reached its expiration date and is no longer active.
          The link creator can generate a new one at any time.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="https://home.kliqs.me"
            className="flex items-center gap-2 px-5 py-3 bg-[#4361ee] text-white text-sm font-semibold rounded-xl hover:bg-[#3a56d4] hover:shadow-lg hover:shadow-[#4361ee]/20 transition-all"
          >
            Create your own link
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="https://home.kliqs.me"
            className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <Home className="w-4 h-4" />
            Go to Kliqs.me
          </Link>
        </div>

        <p className="text-xs text-gray-300 mt-12">Powered by Kliqs.me — Free URL Shortener</p>
      </div>
    </div>
  );
}
