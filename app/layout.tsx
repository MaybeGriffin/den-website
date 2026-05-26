import type { Metadata } from "next";
import "@fontsource/tiktok-sans/latin.css";
import "@fontsource/charm/latin.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://denbible.com"),
  applicationName: "Den",
  title: {
    default: "Den",
    template: "%s | Den",
  },
  description: "Den is a Bible app for Christian growth with daily verses, notes, and friends.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon-32.png",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
