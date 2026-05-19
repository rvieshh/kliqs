import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/generate-slug";

// ─────────────────────────────────────────────────────────────────────────────
// /api/links — Authenticated Link Management
// ─────────────────────────────────────────────────────────────────────────────
// GET    → Returns all links belonging to the authenticated user.
// POST   → Creates a new shortened link with optional alias, expiration, password.
// DELETE → Deletes a link by ID (must be owned by user).
// ─────────────────────────────────────────────────────────────────────────────

const MAX_RETRIES = 5;
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "kliqs.me";

/**
 * Smart URL formatting: auto-prepend https:// if no protocol is present.
 */
function formatUrl(url: string): string {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidSlug(slug: string): boolean {
  return /^[A-Za-z0-9_-]{3,30}$/.test(slug);
}

/**
 * Calculate expiration date from a selection string.
 */
function calculateExpiration(expiration: string): Date | null {
  const now = Date.now();
  switch (expiration) {
    case "1d":
      return new Date(now + 1 * 24 * 60 * 60 * 1000);
    case "7d":
      return new Date(now + 7 * 24 * 60 * 60 * 1000);
    case "14d":
      return new Date(now + 14 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now + 30 * 24 * 60 * 60 * 1000);
    case "never":
    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/links
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const links = await prisma.link.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        slug: true,
        originalUrl: true,
        clicks: true,
        expiresAt: true,
        password: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Return password as boolean (don't expose actual value)
    const sanitized = links.map((l) => ({
      ...l,
      hasPassword: !!l.password,
      password: undefined,
    }));

    return NextResponse.json({ links: sanitized });
  } catch (error) {
    console.error("[links] Failed to fetch user links:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/links
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    url?: string;
    customAlias?: string;
    expiration?: string;
    password?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Smart URL formatting
  let originalUrl = body.url?.trim() || "";
  if (!originalUrl) {
    return NextResponse.json({ error: "Missing required field: url" }, { status: 400 });
  }

  originalUrl = formatUrl(originalUrl);

  if (!isValidUrl(originalUrl)) {
    return NextResponse.json(
      { error: "Invalid URL. Must be a valid HTTP or HTTPS URL." },
      { status: 400 }
    );
  }

  // Block self-referencing
  try {
    const parsed = new URL(originalUrl);
    if (parsed.hostname === ROOT_DOMAIN || parsed.hostname === `www.${ROOT_DOMAIN}`) {
      return NextResponse.json({ error: "Cannot shorten a Kliqs URL." }, { status: 400 });
    }
  } catch {
    // Already validated
  }

  // Check daily limit (10 links/day for free plan)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const linksToday = await prisma.link.count({
    where: {
      userId: session.user.id,
      createdAt: { gte: today },
    },
  });

  if (linksToday >= 10) {
    return NextResponse.json(
      { error: "Daily limit reached. Free plan allows 10 links per day." },
      { status: 429 }
    );
  }

  // Calculate expiration
  const expiration = body.expiration || "7d"; // Default: 7 days
  const expiresAt = calculateExpiration(expiration);

  // Password (optional)
  const password = body.password?.trim() || null;

  const customAlias = body.customAlias?.trim();

  // Handle custom alias
  if (customAlias) {
    if (!isValidSlug(customAlias)) {
      return NextResponse.json(
        { error: "Invalid alias. Use 3-30 alphanumeric characters, hyphens, or underscores." },
        { status: 400 }
      );
    }

    const existing = await prisma.link.findUnique({
      where: { slug: customAlias },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This alias is already taken. Please choose another." },
        { status: 409 }
      );
    }

    try {
      const link = await prisma.link.create({
        data: {
          slug: customAlias,
          originalUrl,
          userId: session.user.id,
          expiresAt,
          password,
        },
      });

      return NextResponse.json(
        {
          id: link.id,
          slug: link.slug,
          originalUrl: link.originalUrl,
          shortUrl: `https://${ROOT_DOMAIN}/${link.slug}`,
          clicks: link.clicks,
          expiresAt: link.expiresAt,
          hasPassword: !!link.password,
          createdAt: link.createdAt,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("[links] Create with alias error:", error);
      return NextResponse.json({ error: "Failed to create link." }, { status: 500 });
    }
  }

  // Generate random slug with collision handling
  let link = null;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    const slug = generateSlug();
    try {
      link = await prisma.link.create({
        data: {
          slug,
          originalUrl,
          userId: session.user.id,
          expiresAt,
          password,
        },
      });
      break;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code: string }).code === "P2002"
      ) {
        attempts++;
        continue;
      }
      console.error("[links] Database error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

  if (!link) {
    return NextResponse.json(
      { error: "Unable to generate a unique short link. Please try again." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      id: link.id,
      slug: link.slug,
      originalUrl: link.originalUrl,
      shortUrl: `https://${ROOT_DOMAIN}/${link.slug}`,
      clicks: link.clicks,
      expiresAt: link.expiresAt,
      hasPassword: !!link.password,
      createdAt: link.createdAt,
    },
    { status: 201 }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/links?id=xxx
// ─────────────────────────────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const linkId = searchParams.get("id");

  if (!linkId) {
    return NextResponse.json({ error: "Missing link ID" }, { status: 400 });
  }

  const link = await prisma.link.findFirst({
    where: { id: linkId, userId: session.user.id },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  await prisma.link.delete({ where: { id: linkId } });

  return NextResponse.json({ success: true });
}
