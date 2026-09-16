// Single source of truth for the site's canonical base URL. Reads from an
// env var first so switching to a custom domain later (fantrip.com or
// similar — no custom domain is registered yet, see project docs) is a
// one-line env change instead of a grep-and-replace across robots.ts,
// sitemap.ts, JSON-LD, and canonical tags.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://fantrip-five.vercel.app";
