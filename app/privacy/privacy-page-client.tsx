"use client";

import { useLayoutEffect } from "react";

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default function PrivacyPageClient() {
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

    enforceTopScroll();
    window.addEventListener("pageshow", enforceTopScroll);

    return () => {
      window.removeEventListener("pageshow", enforceTopScroll);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;

      if (previousScrollRestoration !== null) {
        window.history.scrollRestoration = previousScrollRestoration;
      }
    };
  }, []);

  return null;
}
