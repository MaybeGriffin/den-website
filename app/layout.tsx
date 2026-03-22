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
    default: "Den: Bible, Social, More",
    template: "%s | Den",
  },
  description:
    "Den is an iOS-first faith companion for the Bible, and growing with friends.",
  openGraph: {
    title: "Den: Bible, Social, More",
    description:
      "A premium faith companion centered on the Bible, and growing with friends.",
    url: "https://denbible.com",
    siteName: "Den",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Den: Bible, Social, More",
    description:
      "A premium faith companion centered on the Bible, and growing with friends.",
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
