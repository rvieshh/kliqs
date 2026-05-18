import { cookies } from "next/headers";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { LoginClient } from "./login-client";

// ─────────────────────────────────────────────────────────────────────────────
// Login Page — Server Component
// Reads NEXT_LOCALE cookie to determine language without changing the URL.
// ─────────────────────────────────────────────────────────────────────────────

export default async function LoginPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "en") as Locale;
  const dict = getDictionary(locale);

  return <LoginClient auth={dict.auth} />;
}
