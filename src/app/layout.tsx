import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const cormorant = Cormorant_Garamond({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Coffee? Since 1999 — Chennai's OG Hangout",
    template: "%s | Coffee? Since 1999",
  },
  description:
    "One of Chennai's oldest coffee shops. Since 1999, a cozy escape in Thousand Lights serving exceptional coffee, churros, and good food. Open 8AM–11:45PM daily.",
  keywords: [
    "cafe Chennai", "coffee shop Chennai", "Coffee Since 1999",
    "churros Chennai", "cafe Thousand Lights", "best cafe Chennai",
    "cafe Nungambakkam", "OG cafe Chennai",
  ],
  openGraph: {
    type: "website",
    siteName: "Coffee? Since 1999",
    title: "Coffee? Since 1999 — Chennai's OG Hangout",
    description: "One of Chennai's oldest coffee shops. Since 1999, Thousand Lights, Chennai.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coffee? Since 1999 — Chennai's OG Hangout",
    description: "One of Chennai's oldest coffee shops. Since 1999.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
