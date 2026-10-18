import type { MetadataRoute } from "next";
import { PATHS, absoluteUrl } from "@/lib/seo";

/** Every indexable page, in navigation order. Regenerated on each build. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : path === "/docs" || path === "/docs/installation" ? 0.9 : 0.7,
  }));
}
