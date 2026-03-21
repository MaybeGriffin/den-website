import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://denbible.com"),
  title: {
    default: "Den | Daily Faith Rhythm",
    template: "%s | Den",
  },
  description:
    "Den is an iOS-first faith companion for scripture, guided reflection, and friend-based accountability.",
  openGraph: {
    title: "Den | Daily Faith Rhythm",
    description:
      "A premium faith companion centered on scripture, guided reflection, and steady spiritual consistency.",
    url: "https://denbible.com",
    siteName: "Den",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Den | Daily Faith Rhythm",
    description:
      "A premium faith companion centered on scripture, guided reflection, and steady spiritual consistency.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.variable}>{children}</body>
    </html>
  );
}
