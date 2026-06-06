"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import { startLegalPageTransitionFromAnchor } from "@/app/_components/legal-transition";

const LANDING_WITHOUT_SPLASH_URL = "/?denSkipSplash=1&denTransition=legal-back";

export default function LegalBackButton() {
  const backLinkRef = useRef<HTMLAnchorElement>(null);
  const router = useRouter();

  useEffect(() => {
    router.prefetch(LANDING_WITHOUT_SPLASH_URL);
  }, [router]);

  useLayoutEffect(() => {
    const backLink = backLinkRef.current;

    if (backLink === null) {
      return undefined;
    }

    const anchor = backLink;

    function handleLegalBackClick(event: MouseEvent) {
      startLegalPageTransitionFromAnchor(event, anchor, "back", (href) =>
        router.push(href, { scroll: false }),
      );
    }

    anchor.addEventListener("click", handleLegalBackClick, { capture: true });

    return () => {
      anchor.removeEventListener("click", handleLegalBackClick, { capture: true });
    };
  }, [router]);

  return (
    <a
      aria-label="Go back to the landing page"
      className="privacy-back"
      href={LANDING_WITHOUT_SPLASH_URL}
      ref={backLinkRef}
    >
      <svg
        aria-hidden="true"
        className="privacy-back-icon"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 4L7 12L15 20"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
      </svg>
    </a>
  );
}
