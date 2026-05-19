import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// /api/bio-pages — Authenticated Bio Page Management
// ─────────────────────────────────────────────────────────────────────────────
// GET    → Returns all bio pages belonging to the authenticated user.
// POST   → Creates a new bio page for the authenticated user.
// DELETE → Deletes a bio page by ID (must be owned by user).
// ─────────────────────────────────────────────────────────────────────────────

function isValidHandle(handle: string): boolean {
  return /^[a-z0-9_-]{3,30}$/.test(handle);
}

const RESERVED_SUBDOMAINS = ["home", "dash", "www", "api", "app", "mail", "admin", "support", "help", "blog", "docs", "status"];

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/bio-pages
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bioPages = await prisma.bioPage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bioPages });
  } catch (error) {
    console.error("[bio-pages] Failed to fetch:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/bio-pages
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse body
  let body: {
    title?: string;
    handle?: string;
    description?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const title = body.title?.trim();
  const handle = body.handle?.trim().toLowerCase();
  const description = body.description?.trim() || null;

  // Validate required fields
  if (!title) {
    return NextResponse.json({ error: "Missing required field: title" }, { status: 400 });
  }

  if (!handle) {
    return NextResponse.json({ error: "Missing required field: handle" }, { status: 400 });
  }

  if (!isValidHandle(handle)) {
    return NextResponse.json(
      { error: "Invalid handle. Use 3-30 lowercase alphanumeric characters, hyphens, or underscores." },
      { status: 400 }
    );
  }

  // Check reserved subdomains
  if (RESERVED_SUBDOMAINS.includes(handle)) {
    return NextResponse.json(
      { error: "This subdomain is reserved. Please choose another." },
      { status: 409 }
    );
  }
    );
  }

  // Check handle uniqueness
  const existing = await prisma.bioPage.findUnique({
    where: { handle },
  });

  if (existing) {
    return NextResponse.json(
      { error: "This handle is already taken. Please choose another." },
      { status: 409 }
    );
  }

  // Limit: max 3 bio pages on free plan
  const userPageCount = await prisma.bioPage.count({
    where: { userId: session.user.id },
  });

  if (userPageCount >= 3) {
    return NextResponse.json(
      { error: "Limit reached. Free plan allows up to 3 bio pages." },
      { status: 429 }
    );
  }

  // Create bio page
  try {
    const bioPage = await prisma.bioPage.create({
      data: {
        title,
        handle,
        description,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        id: bioPage.id,
        title: bioPage.title,
        handle: bioPage.handle,
        description: bioPage.description,
        published: bioPage.published,
        views: bioPage.views,
        createdAt: bioPage.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[bio-pages] Create error:", error);
    return NextResponse.json({ error: "Failed to create bio page." }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/bio-pages?id=xxx
// ─────────────────────────────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("id");

  if (!pageId) {
    return NextResponse.json({ error: "Missing bio page ID" }, { status: 400 });
  }

  // Verify ownership
  const bioPage = await prisma.bioPage.findFirst({
    where: { id: pageId, userId: session.user.id },
  });

  if (!bioPage) {
    return NextResponse.json({ error: "Bio page not found" }, { status: 404 });
  }

  await prisma.bioPage.delete({ where: { id: pageId } });

  return NextResponse.json({ success: true });
}
