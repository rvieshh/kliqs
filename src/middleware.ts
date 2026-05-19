import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Kliqs.me — Multi-Subdomain Routing Middleware
// ─────────────────────────────────────────────────────────────────────────────
// Three distinct domain routes handled by a single Next.js codebase:
//
// 1. home.kliqs.me → Landing Page & marketing content
//    Rewrites to: /home/*
//
// 2. dash.kliqs.me → Dashboard, Auth (/login), API routes (/api/auth, /api/links, /api/shorten)
//    Rewrites to: /dash/*
//
// 3. kliqs.me (Root) → Short link resolution only
//    - kliqs.me/       → Redirect to https://home.kliqs.me
//    - kliqs.me/[slug] → Rewrites to /redirect/[slug]
//
// This prevents slug collisions with app routes and cleanly separates concerns.
// ─────────────────────────────────────────────────────────────────────────────

const HOME_DOMAIN = "home.kliqs.me";
const DASH_DOMAIN = "dash.kliqs.me";
const ROOT_DOMAIN = "kliqs.me";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Strip port for local development (e.g., localhost:3000)
  const currentHost = hostname.split(":")[0];

  // ─────────────────────────────────────────────────────────────────────────
  // Skip middleware for static assets and Next.js internals
  // ─────────────────────────────────────────────────────────────────────────
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    return NextResponse.next();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ROOT DOMAIN: kliqs.me → Short link resolution
  // ─────────────────────────────────────────────────────────────────────────
  if (currentHost === ROOT_DOMAIN || currentHost === `www.${ROOT_DOMAIN}`) {
    // Root path → Redirect to the home domain
    if (pathname === "/") {
      return NextResponse.redirect(new URL(`https://${HOME_DOMAIN}`));
    }

    const slug = pathname.slice(1);

    // Ignore paths with multiple segments (invalid slug)
    if (slug.includes("/")) {
      return NextResponse.redirect(new URL(`https://${HOME_DOMAIN}`));
    }

    // Rewrite to internal resolver route: /redirect/[slug]
    const resolveUrl = new URL(`/redirect/${slug}`, request.url);
    return NextResponse.rewrite(resolveUrl);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // HOME DOMAIN: home.kliqs.me → Landing page & marketing (with i18n)
  // ─────────────────────────────────────────────────────────────────────────
  if (currentHost === HOME_DOMAIN) {
    const supportedLocales = ["en", "id"];

    // Check if the path already starts with a supported locale
    const pathLocale = pathname.split("/")[1];
    if (supportedLocales.includes(pathLocale)) {
      // Already on a locale path — rewrite to /home/[locale]/*
      const url = new URL(`/home${pathname}`, request.url);
      return NextResponse.rewrite(url);
    }

    // If visiting root "/" or a non-locale path, detect locale via cookie-first, then GeoIP
    if (pathname === "/" || !supportedLocales.includes(pathLocale)) {
      // Priority 1: Explicit user preference cookie
      const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

      // Priority 2: GeoIP from request headers (Vercel/Cloudflare)
      const country = (
        request.headers.get("x-vercel-ip-country") ||
        request.headers.get("cf-ipcountry") ||
        ""
      ).toString();

      const detectedLocale = cookieLocale && supportedLocales.includes(cookieLocale)
        ? cookieLocale
        : country.toUpperCase() === "ID" ? "id" : "en";

      // Redirect root and non-locale paths to locale-prefixed equivalents
      if (pathname === "/") {
        return NextResponse.redirect(
          new URL(`https://${HOME_DOMAIN}/${detectedLocale}`, request.url)
        );
      }

      // Redirect legal/non-locale paths (e.g., /terms, /privacy) to locale-prefixed path
      return NextResponse.redirect(
        new URL(`https://${HOME_DOMAIN}/${detectedLocale}${pathname}`, request.url)
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DASH DOMAIN: dash.kliqs.me → Dashboard, Auth, API
  // ─────────────────────────────────────────────────────────────────────────
  if (currentHost === DASH_DOMAIN) {
    // Root path → Redirect to /login to prevent 404 after logout
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Rewrite all requests to /dash/* internal path
    const url = new URL(`/dash${pathname}`, request.url);
    return NextResponse.rewrite(url);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // WILDCARD SUBDOMAIN: *.kliqs.me → Bio Pages
  // Any subdomain not matching home/dash/www is treated as a bio page handle.
  // Example: john.kliqs.me → rewrite to /bio/john
  // ─────────────────────────────────────────────────────────────────────────
  const RESERVED_SUBDOMAINS = ["home", "dash", "www", "api", "app", "mail"];
  if (
    currentHost.endsWith(`.${ROOT_DOMAIN}`) &&
    currentHost !== HOME_DOMAIN &&
    currentHost !== DASH_DOMAIN
  ) {
    const subdomain = currentHost.replace(`.${ROOT_DOMAIN}`, "");
    if (subdomain && !RESERVED_SUBDOMAINS.includes(subdomain)) {
      const url = new URL(`/bio/${subdomain}${pathname}`, request.url);
      return NextResponse.rewrite(url);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LOCALHOST (Development) → Default to home behavior
  // ─────────────────────────────────────────────────────────────────────────
  if (currentHost === "localhost" || currentHost === "127.0.0.1") {
    // In development, let all routes pass through without rewriting
    // Developers can access /home, /dash, /redirect directly
    return NextResponse.next();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FALLBACK: Unknown domain → Redirect to home
  // ─────────────────────────────────────────────────────────────────────────
  return NextResponse.redirect(new URL(`https://${HOME_DOMAIN}`));
}

// ─────────────────────────────────────────────────────────────────────────────
// Middleware Configuration
// ─────────────────────────────────────────────────────────────────────────────
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
