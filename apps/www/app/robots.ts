import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

/** Everything is crawlable, AI crawlers included; machine files are kept out of the index with headers (next.config.ts). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
