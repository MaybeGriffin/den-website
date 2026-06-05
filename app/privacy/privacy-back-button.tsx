"use client";

import type { MouseEvent as ReactMouseEvent } from "react";

const LANDING_WITHOUT_SPLASH_URL =
  "/?denSkipSplash=1&denTransition=privacy-back";
const PRIVACY_TRANSITION_EXIT_MS = 360;

function isPlainPrimaryClick(event: ReactMouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.defaultPrevented &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey
  );
}

function startPrivacyBackTransition(event: ReactMouseEvent<HTMLAnchorElement>) {
  if (!isPlainPrimaryClick(event)) {
    return;
  }

  event.preventDefault();
  const href = event.currentTarget.href;
  document.documentElement.classList.add("den-privacy-transition-out-back");

  window.setTimeout(() => {
    window.location.href = href;
  }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : PRIVACY_TRANSITION_EXIT_MS);
}

export default function PrivacyBackButton() {
  return (
    <a
      aria-label="Go back to the landing page"
      className="privacy-back"
      href={LANDING_WITHOUT_SPLASH_URL}
      onClick={startPrivacyBackTransition}
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
