import { renderIcon } from "@/lib/og/icon";

// Web app manifest icons (see app/manifest.ts), generated once at build time.
const ICONS: Record<string, { size: number; maskable?: boolean }> = {
  "icon-192.png": { size: 192 },
  "icon-512.png": { size: 512 },
  "icon-maskable-512.png": { size: 512, maskable: true },
};

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(ICONS).map((file) => ({ file }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const icon = ICONS[file]!;
  return renderIcon(icon.size, { maskable: icon.maskable });
}
