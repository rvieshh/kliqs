import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// GET /redirect/[slug]
// ─────────────────────────────────────────────────────────────────────────────
// Slug resolution endpoint (called via middleware rewrite from kliqs.me/[slug]).
//
// Logic:
// 1. Look up the link by slug.
// 2. If not found → redirect to /link-not-found page.
// 3. If expired → redirect to /link-expired page.
// 4. If password-protected → redirect to /password-required/[slug] page.
// 5. Otherwise → 301 redirect to destination URL + increment clicks.
// ─────────────────────────────────────────────────────────────────────────────

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "home.kliqs.me";
const DASH_DOMAIN = process.env.NEXT_PUBLIC_DASH_DOMAIN || "dash.kliqs.me";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Validate slug format
  if (!slug || !/^[a-zA-Z0-9_-]{1,30}$/.test(slug)) {
    return NextResponse.redirect(
      new URL(`https://${APP_DOMAIN}`),
      { status: 302 }
    );
  }

  try {
    const link = await prisma.link.findUnique({
      where: { slug },
      select: { id: true, originalUrl: true, expiresAt: true, password: true },
    });

    // ─── Not found ────────────────────────────────────────────────────────
    if (!link) {
      return NextResponse.redirect(
        new URL(`https://${DASH_DOMAIN}/link-not-found`),
        { status: 302 }
      );
    }

    // ─── Expired ──────────────────────────────────────────────────────────
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return NextResponse.redirect(
        new URL(`https://${DASH_DOMAIN}/link-expired`),
        { status: 302 }
      );
    }

    // ─── Password Protected ───────────────────────────────────────────────
    if (link.password) {
      return NextResponse.redirect(
        new URL(`https://${DASH_DOMAIN}/password-required/${slug}`),
        { status: 302 }
      );
    }

    // ─── Normal redirect ──────────────────────────────────────────────────
    // Increment clicks (fire-and-forget)
    prisma.link.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    }).catch(() => {});

    return NextResponse.redirect(link.originalUrl, { status: 301 });
  } catch (error) {
    console.error("[resolve] Error resolving slug:", slug, error);
    return NextResponse.redirect(
      new URL(`https://${APP_DOMAIN}`),
      { status: 302 }
    );
  }
}
