import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { generateScheme } from "@/registry/tokens/colors";
import { SITE_SEED } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  const { light } = generateScheme({ seed: SITE_SEED });
  return {
    name: "Expressive: Material 3 Expressive for React",
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: light.surface,
    theme_color: light.surface,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
