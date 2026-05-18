import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/generate-slug";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/shorten
// ─────────────────────────────────────────────────────────────────────────────
// Creates a new short link. Handles both authenticated and anonymous users.
//
// Request Body:
//   { "url": "https://example.com/very-long-url" }
//
// Response (201):
//   { "id": "...", "slug": "xY3kP", "shortUrl": "https://kliqs.me/xY3kP", ... }
//
// CORS: Allows requests from home.kliqs.me (cross-subdomain).
// ─────────────────────────────────────────────────────────────────────────────

const MAX_RETRIES = 5;
const ANON_COOKIE_NAME = "kliqs_anon_id";
const ANON_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "kliqs.me";

const ALLOWED_ORIGINS = [
  "https://home.kliqs.me",
  "http://localhost:3000",
];

function getCorsHeaders(origin: string | null) {
  const headers = new Headers();
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  } else {
    headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGINS[0]);
  }
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Allow-Credentials", "true");
  return headers;
}

/**
 * Validates that a string is a well-formed, absolute HTTP(S) URL.
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTIONS — Handle CORS preflight
// ─────────────────────────────────────────────────────────────────────────────
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // ─────────────────────────────────────────────────────────────────────────
  // 1. Parse & Validate Input
  // ─────────────────────────────────────────────────────────────────────────
  let body: { url?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: corsHeaders }
    );
  }

  const originalUrl = body.url?.trim();

  if (!originalUrl) {
    return NextResponse.json(
      { error: "Missing required field: url" },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!isValidUrl(originalUrl)) {
    return NextResponse.json(
      { error: "Invalid URL. Must be a valid HTTP or HTTPS URL." },
      { status: 400, headers: corsHeaders }
    );
  }

  // Block self-referencing URLs (prevent redirect loops)
  try {
    const parsed = new URL(originalUrl);
    const host = parsed.hostname;
    if (host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`) {
      return NextResponse.json(
        { error: "Cannot shorten a Kliqs URL." },
        { status: 400, headers: corsHeaders }
      );
    }
  } catch {
    // Already validated above; this is just a safeguard
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Resolve Anonymous Session ID
  //    - Read existing cookie OR generate a new UUID
  // ─────────────────────────────────────────────────────────────────────────
  let anonymousSessionId = request.cookies.get(ANON_COOKIE_NAME)?.value || null;
  let shouldSetCookie = false;

  if (!anonymousSessionId) {
    anonymousSessionId = crypto.randomUUID();
    shouldSetCookie = true;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Generate Slug with Collision Handling
  //    Guest links expire in 24 hours; authenticated links are permanent.
  // ─────────────────────────────────────────────────────────────────────────
  let link = null;
  let attempts = 0;

  // Guest links expire in 24 hours
  const isGuest = true; // No auth check on this public endpoint
  const expiresAt = isGuest
    ? new Date(Date.now() + 24 * 60 * 60 * 1000)
    : null;

  while (attempts < MAX_RETRIES) {
    const slug = generateSlug();

    try {
      link = await prisma.link.create({
        data: {
          slug,
          originalUrl,
          anonymousSessionId,
          expiresAt,
        },
      });
      break; // Success — exit retry loop
    } catch (error: unknown) {
      // Check for Prisma unique constraint violation
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code: string }).code === "P2002"
      ) {
        // Slug collision — retry with a new slug
        attempts++;
        continue;
      }

      // Any other error — fail immediately
      console.error("[shorten] Database error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500, headers: corsHeaders }
      );
    }
  }

  if (!link) {
    console.error("[shorten] Exhausted slug generation retries");
    return NextResponse.json(
      { error: "Unable to generate a unique short link. Please try again." },
      { status: 503, headers: corsHeaders }
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Build Response with CORS headers
  // ─────────────────────────────────────────────────────────────────────────
  const shortUrl = `https://${ROOT_DOMAIN}/${link.slug}`;

  const response = NextResponse.json(
    {
      id: link.id,
      slug: link.slug,
      originalUrl: link.originalUrl,
      shortUrl,
      clicks: link.clicks,
      createdAt: link.createdAt,
    },
    { status: 201, headers: corsHeaders }
  );

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Set Anonymous Session Cookie (if newly generated)
  // ─────────────────────────────────────────────────────────────────────────
  if (shouldSetCookie) {
    response.cookies.set(ANON_COOKIE_NAME, anonymousSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none", // Required for cross-subdomain cookies
      maxAge: ANON_COOKIE_MAX_AGE,
      path: "/",
      domain: ".kliqs.me", // Share cookie across subdomains
    });
  }

  return response;
}
