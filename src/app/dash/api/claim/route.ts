import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/claim
// ─────────────────────────────────────────────────────────────────────────────
// Claims anonymous links by assigning them to the authenticated user.
// Called from the client after login when localStorage contains anonymous IDs.
//
// CORS: Allows requests from home.kliqs.me (cross-subdomain).
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = [
  "https://home.kliqs.me",
  "https://dash.kliqs.me",
  "http://localhost:3000",
];

function getCorsHeaders(origin: string | null) {
  const headers = new Headers();
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  } else {
    headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGINS[0]);
  }
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Allow-Credentials", "true");
  return headers;
}

// Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders }
    );
  }

  let body: { linkIds?: string[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: corsHeaders }
    );
  }

  const { linkIds } = body;

  if (!linkIds || !Array.isArray(linkIds) || linkIds.length === 0) {
    return NextResponse.json(
      { error: "No link IDs provided" },
      { status: 400, headers: corsHeaders }
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

    return NextResponse.json(
      {
        claimed: result.count,
        message: `Successfully claimed ${result.count} link(s).`,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("[claim] Failed to claim links:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
