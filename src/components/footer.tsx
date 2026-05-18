import { Link2 } from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Footer Component
// Professional, minimal footer with brand, nav links, and copyright.
// ─────────────────────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-white/50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Link2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight">
                Kliqs.me
              </span>
            </Link>
            <p className="text-sm text-muted max-w-xs">
              The modern URL shortener built for speed, simplicity, and
              developer experience.
            </p>
          </div>

          {/* Nav Links */}
          <div className="flex gap-12">
            <div className="flex flex-col gap-2.5">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">
                Product
              </p>
              <Link
                href="/"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                URL Shortener
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <a
                href="#"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Analytics
              </a>
            </div>
            <div className="flex flex-col gap-2.5">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">
                Company
              </p>
              <a
                href="#"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted/70">
            &copy; {new Date().getFullYear()} Kliqs.me. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-xs text-muted/70 hover:text-muted transition-colors"
            >
              Status
            </a>
            <span className="text-border">·</span>
            <a
              href="#"
              className="text-xs text-muted/70 hover:text-muted transition-colors"
            >
              Docs
            </a>
            <span className="text-border">·</span>
            <a
              href="https://github.com/rvieshh/kliqs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted/70 hover:text-muted transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
