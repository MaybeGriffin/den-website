"use client";

export default function PrivacyBackButton() {
  return (
    <button
      aria-label="Go back to the landing page"
      className="privacy-back"
      onClick={() => {
        window.location.assign("/");
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
