import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// GET /redirect/[slug]
// ─────────────────────────────────────────────────────────────────────────────
// High-performance slug resolution endpoint.
// Called internally via middleware rewrite when a request hits kliqs.me/[slug].
//
// Strategy for efficiency:
// 1. Single SELECT query to fetch only the `originalUrl` field (minimal data).
// 2. Fire-and-forget click increment (non-blocking — we don't await it).
// 3. Immediate 301 (permanent) redirect to the original URL.
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Validate slug format: must be 1-10 alphanumeric characters
  if (!slug || !/^[a-zA-Z0-9]{1,10}$/.test(slug)) {
    return NextResponse.redirect(
      new URL(`https://${process.env.NEXT_PUBLIC_APP_DOMAIN || "home.kliqs.me"}`),
      { status: 302 }
    );
  }

  try {
    // ─────────────────────────────────────────────────────────────────────────
    // 1. Lookup: Fetch only the fields we need (minimal I/O)
    // ─────────────────────────────────────────────────────────────────────────
    const link = await prisma.link.findUnique({
      where: { slug },
      select: { id: true, originalUrl: true },
    });

    if (!link) {
      // Slug not found → redirect to app domain with a 302
      return NextResponse.redirect(
        new URL(`https://${process.env.NEXT_PUBLIC_APP_DOMAIN || "home.kliqs.me"}/not-found`),
        { status: 302 }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Increment clicks: Fire-and-forget (non-blocking)
    //    We intentionally do NOT await this — the user gets their redirect
    //    immediately while the DB update happens in the background.
    // ─────────────────────────────────────────────────────────────────────────
    prisma.link.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    }).catch(() => {
      // Silently handle — a missed click count is acceptable;
      // a failed redirect is not.
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Redirect: 301 Permanent Redirect to the original URL
    //    Using 301 so browsers/CDNs cache the redirect for repeat visitors.
    // ─────────────────────────────────────────────────────────────────────────
    return NextResponse.redirect(link.originalUrl, { status: 301 });
  } catch (error) {
    console.error("[resolve] Error resolving slug:", slug, error);

    // On any DB/unexpected error, gracefully redirect to app
    return NextResponse.redirect(
      new URL(`https://${process.env.NEXT_PUBLIC_APP_DOMAIN || "home.kliqs.me"}`),
      { status: 302 }
    );
  }
}
