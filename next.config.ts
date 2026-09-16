import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      // The guide detail pages (app/guides/[slug]/page.tsx) link back to
      // "/travel" as their "all guides" breadcrumb/back-link, but that route
      // never existed (only app/guides/page.tsx does, and it was empty).
      // Redirecting instead of duplicating the listing at both URLs avoids
      // a duplicate-content SEO issue while still fixing the /travel 404.
      {
        source: "/travel",
        destination: "/guides",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
