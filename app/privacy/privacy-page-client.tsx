"use client";

import { useEffect } from "react";

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default function PrivacyPageClient() {
  useEffect(() => {
    const previousScrollRestoration =
      "scrollRestoration" in window.history ? window.history.scrollRestoration : null;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    scrollToTop();
    window.addEventListener("pageshow", scrollToTop);

    return () => {
      window.removeEventListener("pageshow", scrollToTop);

      if (previousScrollRestoration !== null) {
        window.history.scrollRestoration = previousScrollRestoration;
      }
    };
  }, []);

  return null;
}
