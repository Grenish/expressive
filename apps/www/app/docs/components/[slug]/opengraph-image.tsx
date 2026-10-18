import { ogImage } from "@/lib/og/render";
import { components } from "@/lib/site";

// Prerendered once per component at build time (Next re-exports these route configs).
export function generateStaticParams() {
  return components.map((item) => ({ slug: item.name }));
}
export const dynamicParams = false;

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Expressive: a Material 3 Expressive component for React";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return ogImage(`/docs/components/${slug}`);
}
