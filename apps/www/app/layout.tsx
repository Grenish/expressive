import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Geist,
  Inter,
  JetBrains_Mono,
  Manrope,
  Roboto_Flex,
} from "next/font/google";
import { Playground } from "@/lib/playground";
import { PAGES, SITE } from "@/lib/seo";
import { generateScheme } from "@/registry/tokens/colors";
import { SITE_SEED } from "@/lib/brand";
import "./globals.css";

// Optical sizing only: nothing sets Roboto Flex's width, and the extra axis doubles the download.
const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
  axes: ["opsz"],
});
// Geist, Inter and Manrope are only used when a visitor switches fonts in the playground: don't preload them.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", preload: false });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", preload: false });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", preload: false });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", axes: ["opsz", "wdth"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: PAGES["/"]!.title, template: "%s · Expressive" },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [SITE.author],
  creator: SITE.author.name,
  publisher: SITE.author.name,
  category: "technology",
  openGraph: { siteName: SITE.name, locale: SITE.locale, type: "website" },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

const scheme = generateScheme({ seed: SITE_SEED });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: scheme.light.surface },
    { media: "(prefers-color-scheme: dark)", color: scheme.dark.surface },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVars = [robotoFlex, geist, inter, manrope, mono, bricolage]
    .map((font) => font.variable)
    .join(" ");
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <Playground>
          {children}
        </Playground>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
