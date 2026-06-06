"use client";

export const LEGAL_TRANSITION_EXIT_MS = 360;

const LEGAL_TRANSITION_OUT_CLASSES = [
  "den-privacy-transition-out-forward",
  "den-privacy-transition-out-back",
] as const;

type LegalTransitionDirection = "forward" | "back";

function isPlainPrimaryClick(event: MouseEvent) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey
  );
}

function getNavigationHref(anchor: HTMLAnchorElement) {
  const url = new URL(anchor.href);

  if (url.origin !== window.location.origin) {
    return anchor.href;
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

export function clearLegalTransitionOutClasses() {
  document.documentElement.classList.remove(...LEGAL_TRANSITION_OUT_CLASSES);
}

export function startLegalPageTransitionFromAnchor(
  event: MouseEvent,
  anchor: HTMLAnchorElement,
  direction: LegalTransitionDirection,
  navigate: (href: string) => void,
  onTransitionStart?: () => void,
) {
  if (!isPlainPrimaryClick(event)) {
    return;
  }

  event.preventDefault();

  const root = document.documentElement;

  if (LEGAL_TRANSITION_OUT_CLASSES.some((className) => root.classList.contains(className))) {
    return;
  }

  const href = getNavigationHref(anchor);
  clearLegalTransitionOutClasses();
  onTransitionStart?.();
  root.classList.add(`den-privacy-transition-out-${direction}`);

  window.setTimeout(
    () => navigate(href),
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : LEGAL_TRANSITION_EXIT_MS,
  );
}
