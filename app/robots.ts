import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Was completely missing before — there was no robots.txt (static or
// dynamic) anywhere in the repo, which for an SEO-first site is a real gap:
// without it, crawlers have no explicit sitemap pointer and no guidance on
// what not to index (there's nothing sensitive here yet, but /api/* routes
// return JSON, not pages, and shouldn't be crawled as content).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
