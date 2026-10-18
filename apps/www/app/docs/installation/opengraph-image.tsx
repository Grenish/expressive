import { ogAlt, ogImage } from "@/lib/og/render";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = ogAlt("/docs/installation");

export default function Image() {
  return ogImage("/docs/installation");
}
