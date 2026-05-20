import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ─────────────────────────────────────────────────────────────────────────────
// /api/settings/security — Change Password
// ─────────────────────────────────────────────────────────────────────────────
// POST → Change user's password
//   Body: { currentPassword?: string, newPassword: string }
//   - If user has no existing password (OAuth-only account), currentPassword
//     is not required — they are "setting" their first password.
//   - If user already has a password, currentPassword must match.
// ─────────────────────────────────────────────────────────────────────────────

const SALT_ROUNDS = 12;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate new password
    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json({ error: "New password is required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Fetch the user's current password hash
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user already has a password, verify the current one
    if (user.password) {
      if (!currentPassword || typeof currentPassword !== "string") {
        return NextResponse.json(
          { error: "Current password is required" },
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }
    }

    // Hash the new password and update
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: user.password
        ? "Password updated successfully"
        : "Password set successfully",
    });
  } catch (error) {
    console.error("[settings/security] Failed to update password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
