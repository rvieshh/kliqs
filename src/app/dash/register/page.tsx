import { cookies, headers } from "next/headers";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { RegisterClient } from "./register-client";

// ─────────────────────────────────────────────────────────────────────────────
// Register Page — Server Component
// Standalone locale detection: cookie-first, then GeoIP fallback.
// URL remains exactly /register (no [locale] routing).
// ─────────────────────────────────────────────────────────────────────────────

export default async function RegisterPage() {
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

  return <RegisterClient auth={dict.auth} locale={locale} />;
}
