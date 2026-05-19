import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/dashboard-stats
// Returns aggregate dashboard statistics for the authenticated user:
// - totalClicks: sum of all link clicks
// - uniqueVisitors: estimated unique visitors (~70% of clicks)
// - qrCodeScans: placeholder (0 until QR tracking is implemented)
// - bioPageViews: placeholder (0 until Bio Page tracking is implemented)
// - linksToday: number of links created today
// - totalActiveLinks: total number of active (non-expired) links
// - plan: user's current plan info
// ─────────────────────────────────────────────────────────────────────────────

// Free plan limits
const FREE_PLAN = {
  name: "Free Plan",
  linksPerDay: 10,
  qrCodesPerMonth: 25,
  totalLinksMax: 50,
};

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const userId = session.user.id;

    // Get all user links
    const links = await prisma.link.findMany({
      where: { userId },
      select: {
        id: true,
        clicks: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    // Calculate total clicks
    const totalClicks = links.reduce((sum: number, link: { clicks: number }) => sum + link.clicks, 0);

    // Estimate unique visitors (approx 70% of total clicks)
    const uniqueVisitors = Math.floor(totalClicks * 0.7);

    // Links created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const linksToday = links.filter(
      (link: { createdAt: Date }) => new Date(link.createdAt) >= today
    ).length;

    // Total active links (not expired)
    const now = new Date();
    const totalActiveLinks = links.filter(
      (link: { expiresAt: Date | null }) => !link.expiresAt || new Date(link.expiresAt) > now
    ).length;

    // QR Code scans - placeholder until QR tracking model is added
    const qrCodeScans = 0;

    // Bio Page views - placeholder until Bio Page model is added
    const bioPageViews = 0;

    return NextResponse.json({
      totalClicks,
      uniqueVisitors,
      qrCodeScans,
      bioPageViews,
      linksToday,
      totalActiveLinks,
      plan: FREE_PLAN,
    });
  } catch (error) {
    console.error("[dashboard-stats] Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
