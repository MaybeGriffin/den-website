import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { loadPrivacyPolicy } from "@/lib/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Den.",
};

const APPLE_EULA_URL =
  "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";

function renderRichText(text: string) {
  const parts = text.replace(/Â/g, "").split(/(\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

    if (!match) {
      return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
    }

    const [, label, href] = match;
    return (
      <a
        key={`${href}-${index}`}
        className="legal-link"
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
      >
        {label}
      </a>
    );
  });
}

export default function PrivacyPage() {
  const policy = loadPrivacyPolicy();

  return (
    <main className="page-shell legal-page">
      <div className="mesh-orb one" />
      <div className="mesh-orb two" />
      <div className="content-wrap">
        <section className="glass-card legal-card reveal">
          <div className="legal-header">
            <span className="eyebrow">Privacy and trust</span>
            <h1>{policy.title}</h1>
            <span className="legal-meta">Last updated: {policy.updated}</span>
            <p>
              This page uses the same Den visual world, translated into a calmer
              legal reading experience.
            </p>
            <div className="legal-actions">
              <Link href="/" className="secondary-cta">
                Back to denbible.com
              </Link>
              <a
                href={APPLE_EULA_URL}
                target="_blank"
                rel="noreferrer"
                className="secondary-cta"
              >
                Apple Terms &amp; Conditions / EULA
              </a>
            </div>
          </div>

          <div className="legal-body">
            {policy.sections.map((section) => (
              <article key={section.title} className="legal-section">
                <h2>{section.title}</h2>
                <div className="legal-prose">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={`${section.title}-${index}`}>{renderRichText(paragraph)}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
