"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// Footer Component (Client)
// Locale-aware footer that dynamically routes legal links based on active locale.
// ─────────────────────────────────────────────────────────────────────────────

export function Footer() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const prefix = `/${locale}`;

  return (
    <footer className="w-full border-t border-gray-200/60 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <Link href={prefix} className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Kliqs.me" width={120} height={36} className="h-9 w-auto" />
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-400">
            <Link href={`${prefix}/terms`} className="hover:text-gray-600 transition-colors">
              Terms of Service
            </Link>
            <Link href={`${prefix}/privacy`} className="hover:text-gray-600 transition-colors">
              Privacy Policy
            </Link>
            <a
              href="mailto:support@kliqs.me"
              className="hover:text-gray-600 transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200/40 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Kliqs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
