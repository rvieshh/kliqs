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
// Collision Handling Strategy:
//   - Generate a slug and attempt INSERT.
//   - If a unique constraint violation occurs (P2002), retry with a new slug.
//   - Max 5 retries before failing (statistically near-impossible to exhaust).
// ─────────────────────────────────────────────────────────────────────────────

const MAX_RETRIES = 5;
const ANON_COOKIE_NAME = "kliqs_anon_id";
const ANON_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "kliqs.me";

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

export async function POST(request: NextRequest) {
  // ─────────────────────────────────────────────────────────────────────────
  // 1. Parse & Validate Input
  // ─────────────────────────────────────────────────────────────────────────
  let body: { url?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const originalUrl = body.url?.trim();

  if (!originalUrl) {
    return NextResponse.json(
      { error: "Missing required field: url" },
      { status: 400 }
    );
  }

  if (!isValidUrl(originalUrl)) {
    return NextResponse.json(
      { error: "Invalid URL. Must be a valid HTTP or HTTPS URL." },
      { status: 400 }
    );
  }

  // Block self-referencing URLs (prevent redirect loops)
  try {
    const parsed = new URL(originalUrl);
    const host = parsed.hostname;
    if (host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`) {
      return NextResponse.json(
        { error: "Cannot shorten a Kliqs URL." },
        { status: 400 }
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
  //    Retry loop: on unique constraint violation (Prisma P2002), regenerate.
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
          // userId will be null for anonymous users;
          // it gets populated after auth + link sync
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
        { status: 500 }
      );
    }
  }

  if (!link) {
    // Exhausted all retries (extremely unlikely: 5 consecutive collisions)
    console.error("[shorten] Exhausted slug generation retries");
    return NextResponse.json(
      { error: "Unable to generate a unique short link. Please try again." },
      { status: 503 }
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Build Response
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
    { status: 201 }
  );

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Set Anonymous Session Cookie (if newly generated)
  // ─────────────────────────────────────────────────────────────────────────
  if (shouldSetCookie) {
    response.cookies.set(ANON_COOKIE_NAME, anonymousSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ANON_COOKIE_MAX_AGE,
      path: "/",
    });
  }

  return response;
}
