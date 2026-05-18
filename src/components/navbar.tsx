"use client";

import { useSession, signOut } from "next-auth/react";
import { Link2, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Navbar Component
// Displays brand + auth state (user avatar, sign out, or sign-in link).
// ─────────────────────────────────────────────────────────────────────────────

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Link2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight group-hover:text-accent transition-colors">
            Kliqs.me
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              {/* Dashboard link */}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              {/* User info */}
              <div className="flex items-center gap-3 pl-4 border-l border-border/50">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-8 h-8 rounded-full ring-2 ring-border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-accent">
                      {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
                <span className="hidden sm:inline text-sm font-medium text-foreground truncate max-w-[120px]">
                  {session.user.name}
                </span>

                {/* Sign Out */}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg btn-lift"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
