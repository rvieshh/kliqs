import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getGravatarHash } from "@/lib/gravatar";

// ─────────────────────────────────────────────────────────────────────────────
// NextAuth v5 Configuration
// ─────────────────────────────────────────────────────────────────────────────
// - Uses Prisma Adapter for database-backed sessions/accounts.
// - Google + GitHub OAuth providers.
// - Custom signIn callback implements the Anonymous → Authenticated link sync.
// ─────────────────────────────────────────────────────────────────────────────

const ANON_COOKIE_NAME = "kliqs_anon_id";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    // ─────────────────────────────────────────────────────────────────────────
    // signIn Callback — Anonymous-to-Authenticated Link Sync
    // ─────────────────────────────────────────────────────────────────────────
    // This fires AFTER successful authentication. We:
    // 1. Read the `kliqs_anon_id` cookie (the anonymous session ID).
    // 2. Find all Links with that anonymousSessionId.
    // 3. Update them to belong to the now-authenticated user.
    // 4. Clear the anonymousSessionId field (link is now "owned").
    // 5. Delete the cookie so future links are directly attributed.
    // ─────────────────────────────────────────────────────────────────────────
    async signIn({ user }) {
      try {
        const cookieStore = await cookies();
        const anonId = cookieStore.get(ANON_COOKIE_NAME)?.value;

        if (anonId && user.id) {
          // Sync: Assign all anonymous links to this user
          await prisma.link.updateMany({
            where: {
              anonymousSessionId: anonId,
              userId: null, // Only unowned links
            },
            data: {
              userId: user.id,
              anonymousSessionId: null, // Clear anonymous tracking
            },
          });

          // Clear the anonymous cookie
          cookieStore.delete(ANON_COOKIE_NAME);
        }
      } catch (error) {
        // Log but don't block sign-in — sync failure is non-critical
        console.error("[auth] Link sync error:", error);
      }

      return true; // Allow sign-in to proceed
    },

    // ─────────────────────────────────────────────────────────────────────────
    // session Callback — Attach user ID and Gravatar hash to the session object
    // ─────────────────────────────────────────────────────────────────────────
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        // Generate Gravatar hash from the user's email for retro avatar
        if (user.email) {
          (session.user as unknown as Record<string, unknown>).gravatarHash = getGravatarHash(user.email);
        }
      }
      return session;
    },
  },

  // Use database strategy (default with Prisma Adapter)
  session: {
    strategy: "database",
  },
});
