"use client";

import { SessionProvider } from "next-auth/react";

// ─────────────────────────────────────────────────────────────────────────────
// Client-Side Providers Wrapper
// Wraps the app with NextAuth's SessionProvider for useSession() hook.
// ─────────────────────────────────────────────────────────────────────────────

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
