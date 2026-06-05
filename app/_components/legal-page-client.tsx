"use client";

import { useLayoutEffect } from "react";

const LEGAL_TRANSITION_SEARCH_PARAM = "denTransition";

function scrollToTop() {
  document.querySelector<HTMLElement>(".privacy-shell")?.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function clearLegalTransitionMarker() {
  const currentUrl = new URL(window.location.href);

  if (!currentUrl.searchParams.has(LEGAL_TRANSITION_SEARCH_PARAM)) {
    return;
  }

  currentUrl.searchParams.delete(LEGAL_TRANSITION_SEARCH_PARAM);
  window.history.replaceState(
    window.history.state,
    "",
    `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
  );
}

type LegalPageClientProps = {
  cleanTransitionParam?: boolean;
};

export default function LegalPageClient({
  cleanTransitionParam = false,
}: LegalPageClientProps) {
  useLayoutEffect(() => {
    const previousScrollRestoration =
      "scrollRestoration" in window.history ? window.history.scrollRestoration : null;
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;

    function enforceTopScroll() {
      scrollToTop();
      window.requestAnimationFrame(scrollToTop);
    }

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    document.documentElement.style.scrollBehavior = "auto";

    if (cleanTransitionParam) {
      clearLegalTransitionMarker();
    }

    enforceTopScroll();
    window.addEventListener("pageshow", enforceTopScroll);

    return () => {
      window.removeEventListener("pageshow", enforceTopScroll);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;

      if (previousScrollRestoration !== null) {
        window.history.scrollRestoration = previousScrollRestoration;
      }
    };
  }, [cleanTransitionParam]);

  return null;
}
