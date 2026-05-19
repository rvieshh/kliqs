import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/generate-slug";

// ─────────────────────────────────────────────────────────────────────────────
// /api/links — Authenticated Link Management
// ─────────────────────────────────────────────────────────────────────────────
// GET  → Returns all links belonging to the authenticated user.
// POST → Creates a new permanent shortened link for the authenticated user.
//         Accepts optional custom alias. Links created here never expire.
// ─────────────────────────────────────────────────────────────────────────────

const MAX_RETRIES = 5;
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "kliqs.me";

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

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/links
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const links = await prisma.link.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        slug: true,
        originalUrl: true,
        clicks: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ links });
  } catch (error) {
    console.error("[links] Failed to fetch user links:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/links
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Parse body
  let body: { url?: string; customAlias?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const originalUrl = body.url?.trim();
  const customAlias = body.customAlias?.trim();

  // Validate URL
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

  // Block self-referencing
  try {
    const parsed = new URL(originalUrl);
    if (parsed.hostname === ROOT_DOMAIN || parsed.hostname === `www.${ROOT_DOMAIN}`) {
      return NextResponse.json(
        { error: "Cannot shorten a Kliqs URL." },
        { status: 400 }
      );
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

  // Handle custom alias
  if (customAlias) {
    if (!isValidSlug(customAlias)) {
      return NextResponse.json(
        { error: "Invalid alias. Use 3-30 alphanumeric characters, hyphens, or underscores." },
        { status: 400 }
      );
    }

    // Check uniqueness
    const existing = await prisma.link.findUnique({
      where: { slug: customAlias },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This alias is already taken. Please choose another." },
        { status: 409 }
      );
    }

    // Create with custom alias
    try {
      const link = await prisma.link.create({
        data: {
          slug: customAlias,
          originalUrl,
          userId: session.user.id,
          expiresAt: null, // Permanent for authenticated users
        },
      });

      return NextResponse.json(
        {
          id: link.id,
          slug: link.slug,
          originalUrl: link.originalUrl,
          shortUrl: `https://${ROOT_DOMAIN}/${link.slug}`,
          clicks: link.clicks,
          createdAt: link.createdAt,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("[links] Create with alias error:", error);
      return NextResponse.json(
        { error: "Failed to create link." },
        { status: 500 }
      );
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
          expiresAt: null, // Permanent
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
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
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
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const linkId = searchParams.get("id");

  if (!linkId) {
    return NextResponse.json(
      { error: "Missing link ID" },
      { status: 400 }
    );
  }

  // Verify ownership
  const link = await prisma.link.findFirst({
    where: { id: linkId, userId: session.user.id },
  });

  if (!link) {
    return NextResponse.json(
      { error: "Link not found" },
      { status: 404 }
    );
  }

  await prisma.link.delete({ where: { id: linkId } });

  return NextResponse.json({ success: true });
}
