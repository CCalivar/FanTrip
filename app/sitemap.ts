import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { SITE_URL } from "@/lib/site";

// Also completely missing before this. Individual /match/[id] pages are
// deliberately left out: match IDs come live from football-data.org and
// rotate constantly (see app/api/matches/route.ts), so listing them here
// would just accumulate stale/dead URLs over time. Google reaches them fine
// via the internal links from the homepage and league pages, which is the
// normal pattern for high-churn inventory pages (this is the same reason
// e.g. hotel/flight search sites don't sitemap individual search results).
const LEAGUE_SLUGS = ["champions-league", "premier-league", "laliga", "bundesliga", "serie-a", "brasileirao"];

function getGuideSlugs(): string[] {
  const guidesDir = path.join(process.cwd(), "content/guides");
  try {
    return fs
      .readdirSync(guidesDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => {
        const file = fs.readFileSync(path.join(guidesDir, f), "utf8");
        const { data } = matter(file);
        return (data.slug as string) || f.replace(".md", "");
      });
  } catch {
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/world-cup-2026`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];

  const leagueRoutes: MetadataRoute.Sitemap = LEAGUE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/league/${slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: slug === "champions-league" ? 0.9 : 0.7,
  }));

  const guideRoutes: MetadataRoute.Sitemap = getGuideSlugs().map((slug) => ({
    url: `${SITE_URL}/guides/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...leagueRoutes, ...guideRoutes];
}
