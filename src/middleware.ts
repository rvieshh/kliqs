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
  // HOME DOMAIN: home.kliqs.me → Landing page & marketing
  // ─────────────────────────────────────────────────────────────────────────
  if (currentHost === HOME_DOMAIN) {
    // Rewrite all requests to /home/* internal path
    const url = new URL(`/home${pathname === "/" ? "" : pathname}`, request.url);
    return NextResponse.rewrite(url);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DASH DOMAIN: dash.kliqs.me → Dashboard, Auth, API
  // ─────────────────────────────────────────────────────────────────────────
  if (currentHost === DASH_DOMAIN) {
    // Rewrite all requests to /dash/* internal path
    const url = new URL(`/dash${pathname}`, request.url);
    return NextResponse.rewrite(url);
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
