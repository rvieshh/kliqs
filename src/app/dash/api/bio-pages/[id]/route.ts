import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// /api/bio-pages/[id] — Single Bio Page Management (V2.0)
// ─────────────────────────────────────────────────────────────────────────────
// GET   → Fetch a single bio page with its links (must be owned by user).
// PATCH → Update bio page fields, manage links, handle file uploads.
// ─────────────────────────────────────────────────────────────────────────────

async function fileToDataUrl(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString("base64");
  return `data:${file.type || "image/png"};base64,${base64}`;
}

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

  const contentType = request.headers.get("content-type") || "";

  let updateData: Record<string, unknown> = {};
  let linksData: Array<{ title: string; url: string; icon?: string; thumbnailUrl?: string; order: number }> | undefined;

  if (contentType.includes("multipart/form-data")) {
    // Handle FormData (file uploads)
    const formData = await request.formData();

    const title = formData.get("title") as string | null;
    const displayName = formData.get("displayName") as string | null;
    const description = formData.get("description") as string | null;
    const published = formData.get("published") as string | null;
    const backgroundColor = formData.get("backgroundColor") as string | null;

    if (title !== null) updateData.title = title.trim();
    if (displayName !== null) updateData.displayName = displayName.trim() || null;
    if (description !== null) updateData.description = description.trim() || null;
    if (published !== null) updateData.published = published === "true";
    if (backgroundColor !== null) updateData.backgroundColor = backgroundColor.trim() || null;

    // Avatar file upload
    const avatarFile = formData.get("avatar") as File | null;
    if (avatarFile && avatarFile.size > 0) {
      updateData.avatarUrl = await fileToDataUrl(avatarFile);
    }

    // Background image upload
    const bgFile = formData.get("backgroundImage") as File | null;
    if (bgFile && bgFile.size > 0) {
      updateData.backgroundImageUrl = await fileToDataUrl(bgFile);
    }

    // Links as JSON string in FormData
    const linksJson = formData.get("links") as string | null;
    if (linksJson) {
      try {
        linksData = JSON.parse(linksJson);
      } catch {
        // ignore parse error
      }
    }
  } else {
    // Handle JSON body
    let body: {
      title?: string;
      displayName?: string;
      description?: string;
      avatarUrl?: string;
      backgroundColor?: string;
      backgroundImageUrl?: string;
      published?: boolean;
      links?: Array<{ title: string; url: string; icon?: string; thumbnailUrl?: string; order: number }>;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.displayName !== undefined) updateData.displayName = body.displayName.trim() || null;
    if (body.description !== undefined) updateData.description = body.description.trim() || null;
    if (body.avatarUrl !== undefined) updateData.avatarUrl = body.avatarUrl.trim() || null;
    if (body.backgroundColor !== undefined) updateData.backgroundColor = body.backgroundColor.trim() || null;
    if (body.backgroundImageUrl !== undefined) updateData.backgroundImageUrl = body.backgroundImageUrl.trim() || null;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.links !== undefined) linksData = body.links;
  }

  // Update bio page fields
  await prisma.bioPage.update({
    where: { id },
    data: updateData,
  });

  // Handle links sync (delete all + recreate)
  if (linksData !== undefined) {
    await prisma.bioLink.deleteMany({ where: { bioPageId: id } });

    if (linksData.length > 0) {
      await prisma.bioLink.createMany({
        data: linksData.map((link, index) => ({
          title: link.title.trim(),
          url: link.url.trim(),
          icon: link.icon?.trim() || null,
          thumbnailUrl: link.thumbnailUrl?.trim() || null,
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
