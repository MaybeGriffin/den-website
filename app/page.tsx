import type { Metadata } from "next";
import HomePageClient from "./home-page-client";

const SKIP_LANDING_SPLASH_SEARCH_PARAM = "denSkipSplash";
const LEGAL_TRANSITION_SEARCH_PARAM = "denTransition";
const LEGAL_BACK_TRANSITIONS = new Set(["privacy-back", "terms-back", "legal-back"]);

const description =
  "Den is a Bible app for Christians who want daily verses, guided Bible study, saved notes, and honest conversations with friends in one place.";

export const metadata: Metadata = {
  title: {
    absolute: "Den—Christian Social app",
  },
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
    title: "Den—Christian Social app",
    description,
    url: "https://denbible.com",
    siteName: "Den",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Den—Christian Social app",
    description,
  },
};

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function hasSkipLandingSplashParam(
  searchParams: Record<string, string | string[] | undefined> | undefined,
) {
  const value = searchParams?.[SKIP_LANDING_SPLASH_SEARCH_PARAM];

  return Array.isArray(value) ? value.includes("1") : value === "1";
}

function hasLegalBackTransitionParam(
  searchParams: Record<string, string | string[] | undefined> | undefined,
) {
  const value = searchParams?.[LEGAL_TRANSITION_SEARCH_PARAM];

  return Array.isArray(value)
    ? value.some((entry) => LEGAL_BACK_TRANSITIONS.has(entry))
    : typeof value === "string" && LEGAL_BACK_TRANSITIONS.has(value);
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <HomePageClient
      animateLegalBack={hasLegalBackTransitionParam(resolvedSearchParams)}
      skipInitialSplash={hasSkipLandingSplashParam(resolvedSearchParams)}
    />
  );
}
