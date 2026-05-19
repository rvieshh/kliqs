import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// /api/qr-codes — Authenticated QR Code Management
// ─────────────────────────────────────────────────────────────────────────────
// GET    → Returns all QR codes belonging to the authenticated user.
// POST   → Creates a new QR code with optional logo URL.
// DELETE → Deletes a QR code by ID (must be owned by user).
// ─────────────────────────────────────────────────────────────────────────────

const QR_MONTHLY_LIMIT = 25;

/**
 * Smart URL formatting: auto-prepend https:// if no protocol is present.
 */
function formatUrl(url: string): string {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/qr-codes
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const qrCodes = await prisma.qrCode.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ qrCodes });
  } catch (error) {
    console.error("[qr-codes] Failed to fetch:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/qr-codes
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let title = "";
  let destinationUrl = "";
  let foregroundColor = "#000000";
  let backgroundColor = "#FFFFFF";
  let logoUrl: string | null = null;

  // Support both JSON and FormData
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    title = (formData.get("title") as string)?.trim() || "";
    destinationUrl = (formData.get("destinationUrl") as string)?.trim() || "";
    foregroundColor = (formData.get("foregroundColor") as string)?.trim() || "#000000";
    backgroundColor = (formData.get("backgroundColor") as string)?.trim() || "#FFFFFF";

    // Handle logo file upload
    const logoFile = formData.get("logo") as File | null;
    if (logoFile && logoFile.size > 0) {
      // For now, convert to data URL (in production, upload to S3)
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      const mimeType = logoFile.type || "image/png";
      logoUrl = `data:${mimeType};base64,${base64}`;
    }
  } else {
    // JSON body
    let body: {
      title?: string;
      destinationUrl?: string;
      foregroundColor?: string;
      backgroundColor?: string;
      logoUrl?: string;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    title = body.title?.trim() || "";
    destinationUrl = body.destinationUrl?.trim() || "";
    foregroundColor = body.foregroundColor?.trim() || "#000000";
    backgroundColor = body.backgroundColor?.trim() || "#FFFFFF";
    logoUrl = body.logoUrl?.trim() || null;
  }

  // Validate required fields
  if (!title) {
    return NextResponse.json({ error: "Missing required field: title" }, { status: 400 });
  }

  if (!destinationUrl) {
    return NextResponse.json({ error: "Missing required field: destinationUrl" }, { status: 400 });
  }

  // Enforce 1500 character limit for text payloads
  if (destinationUrl.length > 1500) {
    return NextResponse.json(
      { error: "Content exceeds 1,500 character limit." },
      { status: 400 }
    );
  }

  // Smart URL formatting — only if it looks like a URL
  if (/^(www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/.test(destinationUrl) || /^https?:\/\//.test(destinationUrl)) {
    destinationUrl = formatUrl(destinationUrl);
    if (!isValidUrl(destinationUrl)) {
      return NextResponse.json(
        { error: "Invalid URL format." },
        { status: 400 }
      );
    }
  }
  // Otherwise it's plain text — allowed for QR codes

  // Validate colors
  if (!isValidHexColor(foregroundColor)) {
    return NextResponse.json(
      { error: "Invalid foreground color. Use hex format (e.g., #000000)." },
      { status: 400 }
    );
  }

  if (!isValidHexColor(backgroundColor)) {
    return NextResponse.json(
      { error: "Invalid background color. Use hex format (e.g., #FFFFFF)." },
      { status: 400 }
    );
  }

  // Check monthly limit
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const qrThisMonth = await prisma.qrCode.count({
    where: {
      userId: session.user.id,
      createdAt: { gte: startOfMonth },
    },
  });

  if (qrThisMonth >= QR_MONTHLY_LIMIT) {
    return NextResponse.json(
      { error: "Monthly limit reached. Free plan allows 25 QR codes per month." },
      { status: 429 }
    );
  }

  // Create QR code record
  try {
    const qrCode = await prisma.qrCode.create({
      data: {
        title,
        destinationUrl,
        foregroundColor,
        backgroundColor,
        logoUrl,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        id: qrCode.id,
        title: qrCode.title,
        destinationUrl: qrCode.destinationUrl,
        foregroundColor: qrCode.foregroundColor,
        backgroundColor: qrCode.backgroundColor,
        logoUrl: qrCode.logoUrl,
        scans: qrCode.scans,
        createdAt: qrCode.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[qr-codes] Create error:", error);
    return NextResponse.json({ error: "Failed to create QR code." }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/qr-codes?id=xxx
// ─────────────────────────────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const qrId = searchParams.get("id");

  if (!qrId) {
    return NextResponse.json({ error: "Missing QR code ID" }, { status: 400 });
  }

  const qrCode = await prisma.qrCode.findFirst({
    where: { id: qrId, userId: session.user.id },
  });

  if (!qrCode) {
    return NextResponse.json({ error: "QR code not found" }, { status: 404 });
  }

  await prisma.qrCode.delete({ where: { id: qrId } });

  return NextResponse.json({ success: true });
}
