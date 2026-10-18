import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Geist,
  Inter,
  JetBrains_Mono,
  Manrope,
  Roboto_Flex,
} from "next/font/google";
import { Playground } from "@/lib/playground";
import "./globals.css";

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
  axes: ["opsz", "wdth"],
});
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", axes: ["opsz", "wdth"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code" });

export const metadata: Metadata = {
  title: { default: "Expressive — Material 3 Expressive for React", template: "%s · Expressive" },
  description:
    "Material 3 Expressive design language, shadcn-style ownership. Copy the components into your app.",
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
      </body>
    </html>
  );
}
