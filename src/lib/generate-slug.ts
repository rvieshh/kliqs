// ─────────────────────────────────────────────────────────────────────────────
// Slug Generation Utility
// ─────────────────────────────────────────────────────────────────────────────
// Generates a cryptographically random 5-character alphanumeric slug.
// Uses crypto.getRandomValues for uniform distribution across the charset.
// ─────────────────────────────────────────────────────────────────────────────

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const SLUG_LENGTH = 5;

/**
 * Generates a random slug of `SLUG_LENGTH` characters from the alphanumeric charset.
 * Total combinations: 62^5 = 916,132,832 (~916M unique slugs)
 */
export function generateSlug(): string {
  const bytes = new Uint8Array(SLUG_LENGTH);
  crypto.getRandomValues(bytes);

  let slug = "";
  for (let i = 0; i < SLUG_LENGTH; i++) {
    // Modulo bias is negligible here: 256 % 62 = 8, bias < 3.2%
    // For a URL shortener this is perfectly acceptable.
    slug += CHARSET[bytes[i] % CHARSET.length];
  }

  return slug;
}
