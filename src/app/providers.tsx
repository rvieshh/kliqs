"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/context/LanguageContext";

// ─────────────────────────────────────────────────────────────────────────────
// Client-Side Providers Wrapper
// Wraps the app with NextAuth SessionProvider and LanguageProvider for i18n.
// ─────────────────────────────────────────────────────────────────────────────

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </SessionProvider>
  );
}
