import { handlers } from "@/lib/auth";

// ─────────────────────────────────────────────────────────────────────────────
// NextAuth v5 API Route Handler
// Handles: GET /api/auth/* and POST /api/auth/*
// (signin, signout, callback, session, csrf, providers)
// ─────────────────────────────────────────────────────────────────────────────

export const { GET, POST } = handlers;
