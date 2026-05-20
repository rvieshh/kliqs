import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// /api/bio-pages/[id] — Single Bio Page Management
// ─────────────────────────────────────────────────────────────────────────────
// GET   → Fetch a single bio page with its links (must be owned by user).
// PATCH → Update bio page fields and/or manage links.
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const bioPage = await prisma.bioPage.findFirst({
    where: { id, userId: session.user.id },
    include: {
      links: { orderBy: { order: "asc" } },
    },
  });

  if (!bioPage) {
    return NextResponse.json({ error: "Bio page not found" }, { status: 404 });
  }

  return NextResponse.json({ bioPage });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  const existing = await prisma.bioPage.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Bio page not found" }, { status: 404 });
  }

  let body: {
    title?: string;
    displayName?: string;
    description?: string;
    avatarUrl?: string;
    published?: boolean;
    links?: Array<{ id?: string; title: string; url: string; icon?: string; order: number }>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Build update data
  const updateData: Record<string, unknown> = {};
  if (body.title !== undefined) updateData.title = body.title.trim();
  if (body.displayName !== undefined) updateData.displayName = body.displayName.trim() || null;
  if (body.description !== undefined) updateData.description = body.description.trim() || null;
  if (body.avatarUrl !== undefined) updateData.avatarUrl = body.avatarUrl.trim() || null;
  if (body.published !== undefined) updateData.published = body.published;

  // Update bio page fields
  const updatedPage = await prisma.bioPage.update({
    where: { id },
    data: updateData,
  });

  // Handle links sync (delete all + recreate for simplicity)
  if (body.links !== undefined) {
    // Delete existing links
    await prisma.bioLink.deleteMany({ where: { bioPageId: id } });

    // Create new links
    if (body.links.length > 0) {
      await prisma.bioLink.createMany({
        data: body.links.map((link, index) => ({
          title: link.title.trim(),
          url: link.url.trim(),
          icon: link.icon?.trim() || null,
          order: link.order ?? index,
          bioPageId: id,
        })),
      });
    }
  }

  // Fetch final state with links
  const finalPage = await prisma.bioPage.findUnique({
    where: { id },
    include: { links: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ bioPage: finalPage });
}
