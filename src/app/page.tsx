import { redirect } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// Root Page — Development Fallback
// In production, the middleware rewrites all requests based on subdomain.
// This page only renders in local dev when accessing localhost:3000 directly.
// ─────────────────────────────────────────────────────────────────────────────

export default function RootPage() {
  redirect("/home");
}
