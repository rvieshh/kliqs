import { Link2 } from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Footer Component
// Minimal, clean footer with OkaSpace branding on warm off-white bg.
// ─────────────────────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200/60 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#635bff] flex items-center justify-center">
              <Link2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900">Kliqs.me</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-600 transition-colors">
              Terms
            </a>
            <a
              href="https://github.com/rvieshh/kliqs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200/40 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} OkaSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
