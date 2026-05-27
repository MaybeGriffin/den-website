"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useLayoutEffect, useRef } from "react";
import { APPLE_STANDARD_EULA_URL } from "@/lib/legal";

const APP_STORE_URL = "https://apps.apple.com/";
const PRIVACY_POLICY_URL = "/privacy#top";
const VERSE_ROW_COUNT = 16;
const VERSES_PER_ROW = 18;
const VERSE_GAP_PX = 21;
const VERSE_EDGE_INSET_PX = 0;
const VERSE_SPEED_PX_PER_SECOND = 11;
const SPOTLIGHT_RADIUS_MIN_PX = 34;
const SPOTLIGHT_RADIUS_MAX_PX = 70;
const SPOTLIGHT_RADIUS_VW = 0.1;

const verseRowOpacities = [
  0.12, 0.14, 0.17, 0.19, 0.17, 0.14, 0.12, 0.12,
  0.12, 0.12, 0.14, 0.17, 0.19, 0.17, 0.14, 0.12,
];

const verseSnippets = [
  "Philippians 4:13 I can do all things through Christ which strengtheneth me.",
  "Luke 19:10 For the Son of man is come to seek and to save that which was lost.",
  "Matthew 1:21 And she shall bring forth a son, and thou shalt call his name JESUS: for he shall save his people from their sins.",
  "Isaiah 53:5 But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.",
  "Jeremiah 23:6 In his days Judah shall be saved, and Israel shall dwell safely: and this is his name whereby he shall be called, THE LORD OUR RIGHTEOUSNESS.",
  "1 John 4:14 And we have seen and do testify that the Father sent the Son to be the Saviour of the world.",
  "Matthew 11:28 Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
  "John 12:46 I am come a light into the world, that whosoever believeth on me should not abide in darkness.",
  "Revelation 1:8 I am Alpha and Omega, the beginning and the ending, saith the Lord, which is, and which was, and which is to come, the Almighty.",
  "1 Corinthians 15:57 But thanks be to God, which giveth us the victory through our Lord Jesus Christ.",
  "Romans 5:8 But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.",
  "John 1:1 In the beginning was the Word, and the Word was with God, and the Word was God.",
  "Luke 22:69 Hereafter shall the Son of man sit on the right hand of the power of God.",
  "Philippians 2:11 And that every tongue should confess that Jesus Christ is Lord, to the glory of God the Father.",
];

function getVerseRow(rowIndex: number) {
  return Array.from({ length: VERSES_PER_ROW }, (_, index) => {
    const verseIndex = (rowIndex * 3 + index * 2) % verseSnippets.length;
    return verseSnippets[verseIndex];
  });
}

type VerseMarqueeProps = {
  rowIndex: number;
  verses: string[];
};

function VerseMarquee({ rowIndex, verses }: VerseMarqueeProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const row = rowRef.current;

    if (!row) {
      return;
    }

    const rowElement = row;
    const nodes = Array.from(rowElement.querySelectorAll<HTMLSpanElement>(".den-verse-line"));

    if (nodes.length === 0) {
      return;
    }

    let animationFrame = 0;
    let lastTimestamp = 0;
    let positions: number[] = [];
    let widths: number[] = [];
    const speed = VERSE_SPEED_PX_PER_SECOND;

    function layoutVerses() {
      const rowWidth = rowElement.clientWidth;
      widths = nodes.map((node) => node.offsetWidth);
      const rowOffset = (rowIndex * 197) % Math.max(rowWidth + widths[0], 1);
      let cursor = VERSE_EDGE_INSET_PX - rowOffset;

      positions = widths.map((width) => {
        const current = cursor;
        cursor += width + VERSE_GAP_PX;
        return current;
      });

      nodes.forEach((node, index) => {
        node.style.transform = `translate3d(${positions[index]}px, -50%, 0)`;
      });
      rowElement.classList.add("den-verse-row--ready");
    }

    function animate(timestamp: number) {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const deltaSeconds = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;
      const rowWidth = rowElement.clientWidth;
      const exitX = rowWidth - VERSE_EDGE_INSET_PX;

      positions = positions.map((position) => position + speed * deltaSeconds);

      for (let index = 0; index < positions.length; index += 1) {
        if (positions[index] > exitX) {
          const leftMostStart = positions.reduce((minimum, position) => Math.min(minimum, position), positions[0]);
          positions[index] = leftMostStart - widths[index] - VERSE_GAP_PX;
        }
      }

      nodes.forEach((node, index) => {
        node.style.transform = `translate3d(${positions[index]}px, -50%, 0)`;
      });

      animationFrame = requestAnimationFrame(animate);
    }

    const handleResize = () => layoutVerses();

    layoutVerses();
    document.fonts?.ready.then(layoutVerses);
    window.addEventListener("resize", handleResize);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
      rowElement.classList.remove("den-verse-row--ready");
    };
  }, [rowIndex]);

  return (
    <div
      className="den-verse-row"
      ref={rowRef}
      style={{
        "--den-verse-opacity": verseRowOpacities[rowIndex % verseRowOpacities.length],
      } as CSSProperties}
    >
      {verses.map((verse, index) => (
        <span className="den-verse-line" key={`${rowIndex}-${index}`}>
          {verse}
        </span>
      ))}
    </div>
  );
}

function LegalLink({
  children,
  href,
  onClick,
  target,
}: {
  children: string;
  href: string;
  onClick?: () => void;
  target?: "_blank";
}) {
  const className = "den-legal-link";

  if (target) {
    return (
      <a
        aria-label={children}
        className={className}
        data-label={children}
        href={href}
        onClick={onClick}
        rel="noopener noreferrer"
        target={target}
      >
        <span>{children}</span>
      </a>
    );
  }

  return (
    <Link
      aria-label={children}
      className={className}
      data-label={children}
      href={href}
      scroll
    >
      <span>{children}</span>
    </Link>
  );
}

export default function HomePageClient() {
  const mainScreenRef = useRef<HTMLDivElement>(null);
  const activeTouchIdRef = useRef<number | null>(null);

  function markExternalNavigation() {
    window.sessionStorage.setItem("den:return-from-external", "1");
  }

  function hideVerseSpotlight() {
    mainScreenRef.current?.style.setProperty("--den-verse-spotlight-active", "0");
  }

  function getSpotlightRadius() {
    return Math.min(
      SPOTLIGHT_RADIUS_MAX_PX,
      Math.max(SPOTLIGHT_RADIUS_MIN_PX, window.innerWidth * SPOTLIGHT_RADIUS_VW),
    );
  }

  function updateVerseSpotlightFromPoint(clientX: number, clientY: number) {
    const mainScreen = mainScreenRef.current;

    if (!mainScreen) {
      hideVerseSpotlight();
      return;
    }

    const rect = mainScreen.getBoundingClientRect();
    mainScreen.style.setProperty("--den-verse-spotlight-x", `${clientX - rect.left}px`);
    mainScreen.style.setProperty("--den-verse-spotlight-y", `${clientY - rect.top}px`);
    mainScreen.style.setProperty("--den-verse-spotlight-radius", `${getSpotlightRadius()}px`);
    mainScreen.style.setProperty("--den-verse-spotlight-active", "1");
  }

  function updateVerseSpotlight(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    updateVerseSpotlightFromPoint(event.clientX, event.clientY);
  }

  useLayoutEffect(() => {
    const mainScreen = mainScreenRef.current;

    if (!mainScreen) {
      return undefined;
    }

    function getTrackedTouch(touches: TouchList) {
      const activeTouchId = activeTouchIdRef.current;

      if (activeTouchId === null) {
        return touches[0];
      }

      for (let index = 0; index < touches.length; index += 1) {
        const touch = touches.item(index);

        if (touch?.identifier === activeTouchId) {
          return touch;
        }
      }

      return undefined;
    }

    function handleTouchStart(event: TouchEvent) {
      const touch = event.changedTouches[0];

      if (!touch) {
        return;
      }

      activeTouchIdRef.current = touch.identifier;
      event.preventDefault();
      updateVerseSpotlightFromPoint(touch.clientX, touch.clientY);
    }

    function handleTouchMove(event: TouchEvent) {
      const touch = getTrackedTouch(event.touches);

      if (!touch) {
        return;
      }

      event.preventDefault();
      updateVerseSpotlightFromPoint(touch.clientX, touch.clientY);
    }

    function handleTouchEnd(event: TouchEvent) {
      const touch = getTrackedTouch(event.changedTouches);

      if (!touch) {
        return;
      }

      event.preventDefault();
      activeTouchIdRef.current = null;
      hideVerseSpotlight();
    }

    mainScreen.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
    document.addEventListener("touchcancel", handleTouchEnd, { passive: false });

    return () => {
      mainScreen.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
    };
  });

  return (
    <main className="den-landing">
      <div
        className="den-main-screen"
        onPointerCancel={hideVerseSpotlight}
        onPointerDown={updateVerseSpotlight}
        onPointerLeave={hideVerseSpotlight}
        onPointerMove={updateVerseSpotlight}
        ref={mainScreenRef}
      >
        <div className="den-background" aria-hidden="true" />

        <div className="den-verse-field" aria-hidden="true">
          {Array.from({ length: VERSE_ROW_COUNT }, (_, index) => (
            <VerseMarquee
              key={`verse-row-${index}`}
              rowIndex={index}
              verses={getVerseRow(index)}
            />
          ))}
        </div>

        <div className="den-verse-field den-verse-field--spotlight" aria-hidden="true">
          {Array.from({ length: VERSE_ROW_COUNT }, (_, index) => (
            <VerseMarquee
              key={`verse-spotlight-row-${index}`}
              rowIndex={index}
              verses={getVerseRow(index)}
            />
          ))}
        </div>

        <section className="den-brand-lockup" aria-label="Den">
          <div className="den-logo-row">
            <Image
              alt="Den"
              className="den-logo"
              height={1024}
              priority
              src="/IconTransparent.svg"
              width={1024}
            />
            <span className="den-logo-word">EN</span>
          </div>
          <h1>Your Friends. Your Bible.</h1>
        </section>

        <a
          aria-label="Download on the App Store"
          className="den-app-store-link"
          href={APP_STORE_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            alt="Download on the App Store"
            className="den-app-store-badge"
            height={70}
            priority
            src="/Mobile app store badge.svg"
            width={210}
          />
        </a>

        <footer className="den-legal-nav" aria-label="Legal">
          <div className="den-legal-row">
            <LegalLink
              href={APPLE_STANDARD_EULA_URL}
              onClick={markExternalNavigation}
              target="_blank"
            >
              Terms
            </LegalLink>
            <span aria-hidden="true">&amp;</span>
            <LegalLink href={PRIVACY_POLICY_URL}>Privacy</LegalLink>
          </div>
          <div className="den-copyright-row">
            <span className="den-copyright-symbol" aria-hidden="true">
              &copy;
            </span>
            <span className="den-copyright">2026 James Griffin Britt.</span>
          </div>
        </footer>
      </div>

      <div className="den-splash" aria-hidden="true">
        <div className="den-background" />
        <Image
          alt=""
          className="den-splash-cross"
          height={373}
          priority
          src="/CrusaderCross.svg"
          width={373}
        />
      </div>
    </main>
  );
}
