import { cookies, headers } from "next/headers";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { LoginClient } from "./login-client";

// ─────────────────────────────────────────────────────────────────────────────
// Login Page — Server Component
// Standalone locale detection: cookie-first, then GeoIP fallback.
// URL remains exactly /login (no [locale] routing).
// ─────────────────────────────────────────────────────────────────────────────

export default async function LoginPage() {
  const cookieStore = await cookies();
  const headersList = await headers();

  // 1. Check explicit cookie preference
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;

  // 2. GeoIP fallback from CDN headers
  const country = headersList.get("cf-ipcountry") || headersList.get("x-vercel-ip-country") || "";

  // 3. Priority: cookie > geoip > default 'en'
  let locale: Locale = "en";
  if (localeCookie === "id" || localeCookie === "en") {
    locale = localeCookie;
  } else if (country.toUpperCase() === "ID") {
    locale = "id";
  }

  const dict = getDictionary(locale);

  return <LoginClient auth={dict.auth} locale={locale} />;
}
