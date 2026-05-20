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

    // Theme color fields from FormData
    const textColor = formData.get("textColor") as string | null;
    const buttonBgColor = formData.get("buttonBgColor") as string | null;
    const buttonTextColor = formData.get("buttonTextColor") as string | null;
    const accentColor = formData.get("accentColor") as string | null;
    if (textColor !== null) updateData.textColor = textColor.trim();
    if (buttonBgColor !== null) updateData.buttonBgColor = buttonBgColor.trim();
    if (buttonTextColor !== null) updateData.buttonTextColor = buttonTextColor.trim();
    if (accentColor !== null) updateData.accentColor = accentColor.trim();

    // Avatar border fields from FormData
    const avatarBorderEnabled = formData.get("avatarBorderEnabled") as string | null;
    const avatarBorderColor = formData.get("avatarBorderColor") as string | null;
    const avatarBorderWidth = formData.get("avatarBorderWidth") as string | null;
    if (avatarBorderEnabled !== null) updateData.avatarBorderEnabled = avatarBorderEnabled === "true";
    if (avatarBorderColor !== null) updateData.avatarBorderColor = avatarBorderColor.trim();
    if (avatarBorderWidth !== null) updateData.avatarBorderWidth = parseInt(avatarBorderWidth, 10) || 4;

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
    if ((body as Record<string, unknown>).textColor !== undefined) updateData.textColor = ((body as Record<string, unknown>).textColor as string).trim();
    if ((body as Record<string, unknown>).buttonBgColor !== undefined) updateData.buttonBgColor = ((body as Record<string, unknown>).buttonBgColor as string).trim();
    if ((body as Record<string, unknown>).buttonTextColor !== undefined) updateData.buttonTextColor = ((body as Record<string, unknown>).buttonTextColor as string).trim();
    if ((body as Record<string, unknown>).accentColor !== undefined) updateData.accentColor = ((body as Record<string, unknown>).accentColor as string).trim();
    if ((body as Record<string, unknown>).avatarBorderEnabled !== undefined) updateData.avatarBorderEnabled = (body as Record<string, unknown>).avatarBorderEnabled as boolean;
    if ((body as Record<string, unknown>).avatarBorderColor !== undefined) updateData.avatarBorderColor = ((body as Record<string, unknown>).avatarBorderColor as string).trim();
    if ((body as Record<string, unknown>).avatarBorderWidth !== undefined) updateData.avatarBorderWidth = (body as Record<string, unknown>).avatarBorderWidth as number;
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
