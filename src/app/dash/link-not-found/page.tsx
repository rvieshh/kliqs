"use client";

import { LinkOff, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Link Not Found — Custom 404 Page for Invalid/Missing Links
// ─────────────────────────────────────────────────────────────────────────────

export default function LinkNotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc] px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <LinkOff className="w-10 h-10 text-red-400" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Link Not Found</h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          The short link you&apos;re looking for doesn&apos;t exist or has been removed.
          It may have been deleted by its creator or never existed in the first place.
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

        {/* Branding */}
        <p className="text-xs text-gray-300 mt-12">Powered by Kliqs.me — Free URL Shortener</p>
      </div>
    </div>
  );
}
