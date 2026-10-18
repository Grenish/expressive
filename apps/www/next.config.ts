import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const SITE_URL = "https://expressive.grenishrai.pro";

const config: NextConfig = {
  // Components are imported straight from packages/registry/src.
  turbopack: { root: fileURLToPath(new URL("../..", import.meta.url)) },
  outputFileTracingRoot: fileURLToPath(new URL("../..", import.meta.url)),
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex" }];
    return [
      // Machine-readable files: crawlable, but not search results.
      { source: "/r/:path*", headers: noindex },
      { source: "/pagefind/:path*", headers: noindex },
      // Markdown copies of pages (for AI tools) point search engines at the HTML original.
      { source: "/:path(.*)\\.md", headers: [{ key: "Link", value: `<${SITE_URL}/:path>; rel="canonical"` }] },
      { source: "/index.md", headers: [{ key: "Link", value: `<${SITE_URL}>; rel="canonical"` }] },
    ];
  },
};

export default config;
