import { cookies, headers } from "next/headers";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { ResetPasswordClient } from "./reset-password-client";

// ─────────────────────────────────────────────────────────────────────────────
// Reset Password Page — Server Component
// Standalone locale detection: cookie-first, then GeoIP fallback.
// URL remains exactly /reset-password (no [locale] routing).
// ─────────────────────────────────────────────────────────────────────────────

export default async function ResetPasswordPage() {
  const cookieStore = await cookies();
  const headersList = await headers();

  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const country = headersList.get("cf-ipcountry") || headersList.get("x-vercel-ip-country") || "";

  let locale: Locale = "en";
  if (localeCookie === "id" || localeCookie === "en") {
    locale = localeCookie;
  } else if (country.toUpperCase() === "ID") {
    locale = "id";
  }

  const dict = getDictionary(locale);

  return <ResetPasswordClient auth={dict.auth} locale={locale} />;
}
