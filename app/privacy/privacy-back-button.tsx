"use client";

import { useRouter } from "next/navigation";

const SKIP_LANDING_SPLASH_STORAGE_KEY = "den:skip-landing-splash";

export default function PrivacyBackButton() {
  const router = useRouter();

  return (
    <button
      aria-label="Go back to the landing page"
      className="privacy-back"
      onClick={() => {
        window.sessionStorage.setItem(SKIP_LANDING_SPLASH_STORAGE_KEY, "1");
        router.push("/");
      }}
      type="button"
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
    </button>
  );
}
