import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/claim
// ─────────────────────────────────────────────────────────────────────────────
// Claims anonymous links/QR codes by assigning them to the authenticated user.
// Called from the client after login when localStorage contains anonymous IDs.
//
// Request Body:
//   { "linkIds": ["id1", "id2", ...] }
//
// Effect:
//   - Sets userId to the authenticated user
//   - Clears expiresAt (makes them permanent)
//   - Clears anonymousSessionId
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  let body: { linkIds?: string[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { linkIds } = body;

  if (!linkIds || !Array.isArray(linkIds) || linkIds.length === 0) {
    return NextResponse.json(
      { error: "No link IDs provided" },
      { status: 400 }
    );
  }

  // Limit to 50 IDs per request to prevent abuse
  const idsToProcess = linkIds.slice(0, 50);

  try {
    // Claim: assign to user, make permanent, clear anonymous tracking
    const result = await prisma.link.updateMany({
      where: {
        id: { in: idsToProcess },
        userId: null, // Only claim unowned links
      },
      data: {
        userId: session.user.id,
        expiresAt: null, // Make permanent
        anonymousSessionId: null,
      },
    });

    return NextResponse.json({
      claimed: result.count,
      message: `Successfully claimed ${result.count} link(s).`,
    });
  } catch (error) {
    console.error("[claim] Failed to claim links:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
