"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, PointerEvent as ReactPointerEvent, TouchEvent as ReactTouchEvent } from "react";
import { useLayoutEffect, useRef } from "react";
import { APPLE_STANDARD_EULA_URL } from "@/lib/legal";

const APP_STORE_URL = "https://apps.apple.com/";
const PRIVACY_POLICY_URL = "/privacy#top";
const VERSE_ROW_COUNT = 16;
const VERSES_PER_ROW = 18;
const VERSE_GAP_PX = 21;
const VERSE_EDGE_INSET_PX = 0;
const VERSE_SPEED_PX_PER_SECOND = 11;
const VERSE_PROTECTED_GAP_PX = 14;
const VERSE_PROTECTED_FEATHER_PX = 12;
const LOGO_VISIBLE_ART_INSET_RATIO = 0.256;
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
  const spotlightMaskRef = useRef<SVGMaskElement>(null);
  const spotlightGradientRef = useRef<SVGRadialGradientElement>(null);
  const spotlightGradientRectRef = useRef<SVGRectElement>(null);
  const spotlightHolePathRef = useRef<SVGPathElement>(null);
  const spotlightFeatherPathRef = useRef<SVGPathElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const logoWordRef = useRef<HTMLSpanElement>(null);
  const brandTitleRef = useRef<HTMLHeadingElement>(null);
  const appStoreLinkRef = useRef<HTMLAnchorElement>(null);
  const legalNavRef = useRef<HTMLElement>(null);

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

  function getRoundedRectPath(left: number, top: number, right: number, bottom: number) {
    const width = right - left;
    const height = bottom - top;
    const radius = Math.min(18, width / 2, height / 2);

    return [
      `M ${left + radius} ${top}`,
      `H ${right - radius}`,
      `Q ${right} ${top} ${right} ${top + radius}`,
      `V ${bottom - radius}`,
      `Q ${right} ${bottom} ${right - radius} ${bottom}`,
      `H ${left + radius}`,
      `Q ${left} ${bottom} ${left} ${bottom - radius}`,
      `V ${top + radius}`,
      `Q ${left} ${top} ${left + radius} ${top}`,
      "Z",
    ].join(" ");
  }

  function getProtectedPath(rect?: DOMRect, extraPadding = 0) {
    const mainScreen = mainScreenRef.current;

    if (!mainScreen || !rect) {
      return "";
    }

    const mainRect = mainScreen.getBoundingClientRect();
    const padding = VERSE_PROTECTED_GAP_PX + extraPadding;
    const left = Math.max(0, rect.left - mainRect.left - padding);
    const top = Math.max(0, rect.top - mainRect.top - padding);
    const right = Math.min(mainRect.width, rect.right - mainRect.left + padding);
    const bottom = Math.min(mainRect.height, rect.bottom - mainRect.top + padding);

    if (right <= left || bottom <= top) {
      return "";
    }

    return getRoundedRectPath(left, top, right, bottom);
  }

  function doesSpotlightIntersectRect(rect: DOMRect | undefined, pointerX: number, pointerY: number, radius: number, extraPadding = 0) {
    const mainScreen = mainScreenRef.current;

    if (!mainScreen || !rect) {
      return false;
    }

    const mainRect = mainScreen.getBoundingClientRect();
    const padding = VERSE_PROTECTED_GAP_PX + extraPadding;
    const left = rect.left - mainRect.left - padding;
    const top = rect.top - mainRect.top - padding;
    const right = rect.right - mainRect.left + padding;
    const bottom = rect.bottom - mainRect.top + padding;
    const closestX = Math.min(Math.max(pointerX, left), right);
    const closestY = Math.min(Math.max(pointerY, top), bottom);
    const distanceX = pointerX - closestX;
    const distanceY = pointerY - closestY;

    return distanceX * distanceX + distanceY * distanceY <= radius * radius;
  }

  function getVisibleLogoArtRect() {
    const logo = logoRef.current;

    if (!logo) {
      return undefined;
    }

    const rect = logo.getBoundingClientRect();
    const insetX = rect.width * LOGO_VISIBLE_ART_INSET_RATIO;
    const insetY = rect.height * LOGO_VISIBLE_ART_INSET_RATIO;

    return new DOMRect(
      rect.left + insetX,
      rect.top + insetY,
      rect.width - insetX * 2,
      rect.height - insetY * 2,
    );
  }

  function updateSpotlightMask(clientX: number, clientY: number) {
    const mainScreen = mainScreenRef.current;
    const spotlightMask = spotlightMaskRef.current;
    const spotlightGradient = spotlightGradientRef.current;
    const spotlightGradientRect = spotlightGradientRectRef.current;
    const spotlightHolePath = spotlightHolePathRef.current;
    const spotlightFeatherPath = spotlightFeatherPathRef.current;

    if (
      !mainScreen ||
      !spotlightMask ||
      !spotlightGradient ||
      !spotlightGradientRect ||
      !spotlightHolePath ||
      !spotlightFeatherPath
    ) {
      return;
    }

    const mainRect = mainScreen.getBoundingClientRect();
    const pointerX = clientX - mainRect.left;
    const pointerY = clientY - mainRect.top;
    const radius = getSpotlightRadius();
    const protectedRects = [
      appStoreLinkRef.current?.getBoundingClientRect(),
      legalNavRef.current?.getBoundingClientRect(),
      getVisibleLogoArtRect(),
      logoWordRef.current?.getBoundingClientRect(),
      brandTitleRef.current?.getBoundingClientRect(),
    ].filter((rect) => doesSpotlightIntersectRect(rect, pointerX, pointerY, radius, VERSE_PROTECTED_FEATHER_PX));
    const protectedPaths = protectedRects.map((rect) => getProtectedPath(rect)).join(" ");
    const featherPaths = protectedRects
      .map((rect) => getProtectedPath(rect, VERSE_PROTECTED_FEATHER_PX))
      .join(" ");

    spotlightMask.setAttribute("x", "0");
    spotlightMask.setAttribute("y", "0");
    spotlightMask.setAttribute("width", `${mainRect.width}`);
    spotlightMask.setAttribute("height", `${mainRect.height}`);
    spotlightGradient.setAttribute("cx", `${pointerX}`);
    spotlightGradient.setAttribute("cy", `${pointerY}`);
    spotlightGradient.setAttribute("r", `${radius}`);
    spotlightGradientRect.setAttribute("width", `${mainRect.width}`);
    spotlightGradientRect.setAttribute("height", `${mainRect.height}`);
    spotlightHolePath.setAttribute("d", protectedPaths);
    spotlightFeatherPath.setAttribute("d", featherPaths);
  }

  function updateVerseSpotlightFromPoint(clientX: number, clientY: number) {
    const mainScreen = mainScreenRef.current;

    if (!mainScreen) {
      hideVerseSpotlight();
      return;
    }

    const rect = mainScreen.getBoundingClientRect();
    updateSpotlightMask(clientX, clientY);
    mainScreen.style.setProperty("--den-verse-spotlight-x", `${clientX - rect.left}px`);
    mainScreen.style.setProperty("--den-verse-spotlight-y", `${clientY - rect.top}px`);
    mainScreen.style.setProperty("--den-verse-spotlight-radius", `${getSpotlightRadius()}px`);
    mainScreen.style.setProperty("--den-verse-spotlight-active", "1");
  }

  function updateVerseSpotlight(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" && !event.isPrimary) {
      return;
    }

    updateVerseSpotlightFromPoint(event.clientX, event.clientY);
  }

  function updateVerseSpotlightFromTouch(event: ReactTouchEvent<HTMLDivElement>) {
    const touch = event.touches[0] ?? event.changedTouches[0];

    if (!touch) {
      hideVerseSpotlight();
      return;
    }

    updateVerseSpotlightFromPoint(touch.clientX, touch.clientY);
  }

  function endTouchSpotlight(event: ReactTouchEvent<HTMLDivElement>) {
    if (event.touches.length === 0) {
      hideVerseSpotlight();
    }
  }

  function endPointerSpotlight(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      hideVerseSpotlight();
    }
  }

  return (
    <main className="den-landing">
      <div
        className="den-main-screen"
        onPointerCancel={hideVerseSpotlight}
        onPointerDown={updateVerseSpotlight}
        onPointerLeave={hideVerseSpotlight}
        onPointerMove={updateVerseSpotlight}
        onPointerUp={endPointerSpotlight}
        onTouchCancel={endTouchSpotlight}
        onTouchEnd={endTouchSpotlight}
        onTouchMove={updateVerseSpotlightFromTouch}
        onTouchStart={updateVerseSpotlightFromTouch}
        ref={mainScreenRef}
      >
        <div className="den-background" aria-hidden="true" />

        <svg className="den-spotlight-mask" aria-hidden="true">
          <defs>
            <radialGradient id="den-verse-spotlight-gradient" ref={spotlightGradientRef} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="28%" stopColor="white" stopOpacity="0.7" />
              <stop offset="62%" stopColor="white" stopOpacity="0.34" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <filter id="den-verse-spotlight-feather">
              <feGaussianBlur stdDeviation="7" />
            </filter>
            <mask id="den-verse-spotlight-mask" ref={spotlightMaskRef} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
              <rect ref={spotlightGradientRectRef} x="0" y="0" fill="url(#den-verse-spotlight-gradient)" />
              <path ref={spotlightFeatherPathRef} d="" fill="black" opacity="0.95" filter="url(#den-verse-spotlight-feather)" />
              <path ref={spotlightHolePathRef} d="" fill="black" />
            </mask>
          </defs>
        </svg>

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
              ref={logoRef}
              src="/IconTransparent.svg"
              width={1024}
            />
            <span className="den-logo-word" ref={logoWordRef}>EN</span>
          </div>
          <h1 ref={brandTitleRef}>Your Friends. Your Bible.</h1>
        </section>

        <a
          aria-label="Download on the App Store"
          className="den-app-store-link"
          href={APP_STORE_URL}
          ref={appStoreLinkRef}
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

        <footer className="den-legal-nav" aria-label="Legal" ref={legalNavRef}>
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
