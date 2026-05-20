import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/dashboard-stats
// Returns aggregate dashboard statistics for the authenticated user:
// - totalClicks: sum of all link clicks
// - uniqueVisitors: estimated unique visitors (~70% of clicks)
// - qrCodeScans: sum of scans from user's QR codes
// - bioPageViews: sum of views from user's bio pages
// - linksToday: number of links created today
// - totalActiveLinks: total number of active (non-expired) links
// - qrCodesThisMonth: number of QR codes created this month
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

    // QR Code scans - sum of all scans from user's QR codes
    const qrCodes = await prisma.qrCode.findMany({
      where: { userId },
      select: { scans: true, createdAt: true },
    });
    const qrCodeScans = qrCodes.reduce((sum: number, qr: { scans: number }) => sum + qr.scans, 0);

    // QR codes created this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const qrCodesThisMonth = qrCodes.filter(
      (qr: { createdAt: Date }) => new Date(qr.createdAt) >= monthStart
    ).length;

    // Bio Page views - sum of views from user's bio pages
    const bioPages = await prisma.bioPage.findMany({
      where: { userId },
      select: { views: true },
    });
    const bioPageViews = bioPages.reduce((sum: number, page: { views: number }) => sum + page.views, 0);

    return NextResponse.json({
      totalClicks,
      uniqueVisitors,
      qrCodeScans,
      bioPageViews,
      linksToday,
      totalActiveLinks,
      qrCodesThisMonth,
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
