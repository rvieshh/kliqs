import { createHash } from "crypto";

// ─────────────────────────────────────────────────────────────────────────────
// Gravatar Utility
// Generates a Gravatar URL using the "retro" style fallback.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate MD5 hash of an email for Gravatar.
 * Trims whitespace and lowercases the email per Gravatar spec.
 */
export function getGravatarHash(email: string): string {
  const normalized = email.trim().toLowerCase();
  return createHash("md5").update(normalized).digest("hex");
}

/**
 * Generate the full Gravatar URL with retro style fallback.
 */
export function getGravatarUrl(email: string, size: number = 40): string {
  const hash = getGravatarHash(email);
  return `https://www.gravatar.com/avatar/${hash}?d=retro&s=${size}`;
}
