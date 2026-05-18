import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Kliqs.me - Subdomain Routing Middleware
// ─────────────────────────────────────────────────────────────────────────────
// This middleware differentiates between two domains:
//
// 1. App Domain (home.kliqs.me) → Serves the full web application
//    (Landing page, Dashboard, Auth, API routes)
//
// 2. Resolver Domain (kliqs.me) → Strictly for resolving short links
//    - GET kliqs.me/        → Redirects to https://home.kliqs.me
//    - GET kliqs.me/[slug]  → Resolves slug and redirects to original URL
//
// This separation prevents slug collisions with app routes (e.g., /login, /dashboard).
// ─────────────────────────────────────────────────────────────────────────────

const APP_DOMAIN = "home.kliqs.me";
const ROOT_DOMAIN = "kliqs.me";

// Paths that should never be treated as slugs (static assets, Next.js internals)
const IGNORED_PATHS = [
  "/_next",
  "/favicon.ico",
  "/api",
  "/robots.txt",
  "/sitemap.xml",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Strip port for local development (e.g., localhost:3000)
  const currentHost = hostname.split(":")[0];

  // ─────────────────────────────────────────────────────────────────────────
  // Skip middleware for static assets and Next.js internals
  // ─────────────────────────────────────────────────────────────────────────
  if (IGNORED_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RESOLVER DOMAIN: kliqs.me (root domain without "home." subdomain)
  // ─────────────────────────────────────────────────────────────────────────
  if (currentHost === ROOT_DOMAIN || currentHost === `www.${ROOT_DOMAIN}`) {
    // Root path → Redirect to the app domain
    if (pathname === "/") {
      return NextResponse.redirect(new URL(`https://${APP_DOMAIN}`));
    }

    // Any other path → Treat as a slug, rewrite to the resolver route
    // The slug is the pathname without the leading "/"
    const slug = pathname.slice(1);

    // Ignore paths with multiple segments (e.g., /some/nested/path)
    if (slug.includes("/")) {
      return NextResponse.redirect(new URL(`https://${APP_DOMAIN}`));
    }

    // Rewrite to internal resolver API route: /api/resolve/[slug]
    const resolveUrl = new URL(`/api/resolve/${slug}`, request.url);
    return NextResponse.rewrite(resolveUrl);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // APP DOMAIN: home.kliqs.me (or localhost for development)
  // ─────────────────────────────────────────────────────────────────────────
  // Allow all requests to pass through normally to the Next.js app
  // This handles: Landing page, Dashboard, Auth, API routes, etc.
  if (
    currentHost === APP_DOMAIN ||
    currentHost === "localhost" ||
    currentHost === "127.0.0.1"
  ) {
    return NextResponse.next();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FALLBACK: Unknown domain → Redirect to app domain
  // ─────────────────────────────────────────────────────────────────────────
  return NextResponse.redirect(new URL(`https://${APP_DOMAIN}`));
}

// ─────────────────────────────────────────────────────────────────────────────
// Middleware Configuration
// Only run on paths that are NOT static files or Next.js internals
// ─────────────────────────────────────────────────────────────────────────────
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
