import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/links/verify-password
// Verifies a password for a password-protected link.
// Also serves as a "link check" endpoint:
// - 404: link doesn't exist
// - 410: link has expired
// - 403: link has a password and the provided password is wrong/empty
// - 200: password correct OR link has no password → returns destinationUrl
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: { slug?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const slug = body.slug?.trim();
  const password = body.password ?? "";

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const link = await prisma.link.findUnique({
    where: { slug },
    select: { id: true, originalUrl: true, password: true, expiresAt: true },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  // Check expiration
  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    return NextResponse.json({ error: "This link has expired" }, { status: 410 });
  }

  // If the link has no password, return destination immediately
  if (!link.password) {
    // Increment clicks (fire-and-forget)
    prisma.link.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    }).catch(() => {});

    return NextResponse.json({ destinationUrl: link.originalUrl });
  }

  // Link has a password — verify it
  if (link.password !== password) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 403 });
  }

  // Password correct — increment clicks (fire-and-forget)
  prisma.link.update({
    where: { id: link.id },
    data: { clicks: { increment: 1 } },
  }).catch(() => {});

  return NextResponse.json({ destinationUrl: link.originalUrl });
}
