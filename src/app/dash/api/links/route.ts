import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/links
// Returns all links belonging to the authenticated user.
// Protected route — returns 401 if not authenticated.
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
