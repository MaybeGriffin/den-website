import type { Metadata } from "next";
import HomePageClient from "./home-page-client";

const description =
  "Den is a Bible app for Christians who want daily verses, guided Bible study, saved notes, and honest conversations with friends in one place.";

export const metadata: Metadata = {
  title: "Bible App for Christian Friends, Notes, and Daily Verses | Den",
  description,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "Bible App for Christian Friends, Notes, and Daily Verses | Den",
    description,
    url: "https://denbible.com",
    siteName: "Den",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bible App for Christian Friends, Notes, and Daily Verses | Den",
    description,
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
