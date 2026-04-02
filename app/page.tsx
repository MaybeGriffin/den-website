"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { APPLE_STANDARD_EULA_URL } from "@/lib/legal";

const APP_STORE_URL = "https://apps.apple.com/";

const featureRows = [
  [
    {
      title: "Grow with Friends",
      body: "Add friends, build a streak with each one, and discuss a verse every day as your friendships and faith grow stronger.",
    },
    {
      title: "Track Your Progress",
      body: "Watch your understanding of the Bible grow through saved notes, highlights, and reading milestones that show how far you've come.",
    },
  ],
  [
    {
      title: "Personalized Verses",
      body: "Wake up to a fresh daily verse, along with different verses for every streak and guided Bible study without running into the same passages over and over.",
    },
    {
      title: "Challenge Yourself",
      body: "Grow deeper in your faith as you explore with your lion, complete guided Bible studies, and discuss verses with friends to build knowledge and confidence.",
    },
  ],
];

function AppleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="den-apple-icon"
      fill="currentColor"
      viewBox="0 0 384 512"
    >
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function DownloadButton() {
  return (
    <a
      className="den-download-button"
      href={APP_STORE_URL}
      rel="noreferrer"
      target="_blank"
    >
      <AppleIcon />
      <span>Download Now</span>
    </a>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mascotWidth, setMascotWidth] = useState<number>();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    function syncWidth() {
      if (!headlineRef.current) {
        return;
      }

      setMascotWidth(headlineRef.current.offsetWidth);
    }

    syncWidth();

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(syncWidth)
        : null;

    if (headlineRef.current && observer) {
      observer.observe(headlineRef.current);
    }

    window.addEventListener("resize", syncWidth);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", syncWidth);
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (
        menuRef.current?.contains(target) ||
        menuButtonRef.current?.contains(target)
      ) {
        return;
      }

      setMenuOpen(false);
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handlePointerDown);
    }

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [menuOpen]);

  return (
    <main className="den-landing">
      <div aria-hidden="true" className="den-wavy-container">
        <svg
          height="100%"
          preserveAspectRatio="none"
          viewBox="0 0 1000 1000"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: 50 }, (_, index) => {
            const y = 20 + index * 20;
            const glow = index % 3 === 0;

            return (
              <g key={y}>
                <path
                  className="den-wavy-path"
                  d={`M0 ${y} Q 250 ${y - 50}, 500 ${y} T 1000 ${y}`}
                />
                {glow ? (
                  <path
                    className="den-glow-line"
                    d={`M0 ${y} Q 250 ${y - 50}, 500 ${y} T 1000 ${y}`}
                    style={{
                      animationDelay: `${-(index % 13) - (index / 3)}s`,
                    }}
                  />
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="den-menu-shell">
        <button
          ref={menuButtonRef}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
          className={`den-menu-toggle${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((current) => !current)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>

        <div
          ref={menuRef}
          className={`den-mobile-menu${menuOpen ? " open" : ""}`}
        >
          <Link href="/privacy" onClick={() => setMenuOpen(false)}>
            Privacy Policy
          </Link>
          <a
            href={APPLE_STANDARD_EULA_URL}
            onClick={() => setMenuOpen(false)}
            rel="noreferrer"
            target="_blank"
          >
            Terms of Service
          </a>
        </div>
      </div>

      <section className="den-hero">
        <div className="den-hero-inner">
          <h1 className="den-hero-title">
            <span className="den-brand-dark">The</span>{" "}
            <span className="den-brand-light">Den</span>{" "}
            <span className="den-brand-dark">App</span>
            <span className="den-title-break" />
            <span className="den-brand-dark">Bible, Social, More.</span>
          </h1>

          <p className="den-hero-copy">
            Grow your relationship with the Lord and your friends
            <br />
            Den is here to help you on your journey
          </p>

          <div className="den-hero-action">
            <DownloadButton />
          </div>
        </div>
      </section>

      <section className="den-feature-section">
        {featureRows.map((row, rowIndex) => (
          <div className="den-carousel-row" key={`row-${rowIndex}`}>
            <div
              className={`den-carousel-track${rowIndex === 1 ? " reverse" : ""}`}
            >
              {[...row, ...row].map((card, cardIndex) => (
                <article className="den-feature-card" key={`${card.title}-${cardIndex}`}>
                  <h2>{card.title}</h2>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="den-cta-section">
        <div className="den-cta-divider" />
        <h2 className="den-cta-title" ref={headlineRef}>
          <span className="den-brand-dark">Get started with</span>{" "}
          <span className="den-brand-light">Den</span>
        </h2>

        <DownloadButton />

        <div className="den-mascot-wrap">
          <Image
            alt="Den icon"
            className="den-mascot-image"
            height={1024}
            priority
            src="/Icon.png"
            style={mascotWidth ? { width: `${mascotWidth}px` } : undefined}
            width={1024}
          />
        </div>
      </section>

      <footer className="den-footer">
        <div className="den-footer-inner">
          <div className="den-footer-copy">© 2024 DEN. ALL RIGHTS RESERVED.</div>

          <div className="den-footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <a href={APPLE_STANDARD_EULA_URL} rel="noreferrer" target="_blank">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
