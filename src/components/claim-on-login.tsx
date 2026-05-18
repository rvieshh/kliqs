"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// ClaimOnLogin Component
// ─────────────────────────────────────────────────────────────────────────────
// Checks localStorage for anonymous link IDs after successful login.
// If found, fires an API call to claim them (assign to user, make permanent).
// Then clears localStorage.
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "kliqs_anonymous_links";

export function ClaimOnLogin() {
  const { data: session, status } = useSession();
  const hasClaimed = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id || hasClaimed.current) {
      return;
    }

    const storedIds = localStorage.getItem(STORAGE_KEY);
    if (!storedIds) return;

    let linkIds: string[];
    try {
      linkIds = JSON.parse(storedIds);
      if (!Array.isArray(linkIds) || linkIds.length === 0) return;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    hasClaimed.current = true;

    // Fire claim API
    fetch("https://dash.kliqs.me/api/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkIds }),
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          // Clear localStorage on successful claim
          localStorage.removeItem(STORAGE_KEY);
        }
      })
      .catch((err) => {
        console.error("[claim] Failed to claim anonymous links:", err);
      });
  }, [status, session]);

  // This component renders nothing — it's purely side-effect based
  return null;
}
