import type { Metadata } from "next";
import LegalBackButton from "@/app/_components/legal-back-button";
import LegalPageClient from "@/app/_components/legal-page-client";
import { APPLE_STANDARD_EULA_URL } from "@/lib/legal";

const LEGAL_TRANSITION_SEARCH_PARAM = "denTransition";
const TERMS_FORWARD_TRANSITION = "terms-forward";
const PRIVACY_POLICY_URL = "https://denbible.com/privacy";
const CONTACT_EMAIL = "Griffinbritt@denbible.com";

export const metadata: Metadata = {
  title: "Usage & Billing Terms",
  description:
    "Usage and billing terms for Den subscriptions, AI message limits, and Extra Message purchases.",
  alternates: {
    canonical: "/terms",
  },
};

type TermsSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

const termsSections: TermsSection[] = [
  {
    title: "Subscriptions",
    paragraphs: [
      "Den offers monthly subscriptions through Apple In-App Purchase.",
      "Pro is $20 per month.",
      "Premium is $40 per month.",
      "Subscriptions renew monthly until canceled. You can cancel anytime through your Apple Account subscription settings.",
    ],
  },
  {
    title: "Pro",
    paragraphs: ["Pro includes:"],
    bullets: [
      "Access to all Bible versions listed in Den",
      "Chat with The Bible",
      "Explore Mode",
      "400 AI messages per month shared across Chat with The Bible and Explore Mode",
    ],
  },
  {
    title: "Premium",
    paragraphs: ["Premium includes:"],
    bullets: [
      "Pro features",
      "Our most capable AI model",
      "Chat with The Bible",
      "Explore Mode",
      "700 AI messages per month shared across Chat with The Bible and Explore Mode",
    ],
  },
  {
    title: "AI Message Limits",
    paragraphs: [
      "AI message limits are shared across Chat with The Bible and Explore Mode.",
      "Each user message and each AI response counts as one AI message.",
      "Example: one user question and one AI response usually count as 2 AI messages.",
      "Daily limit: up to 45 user messages and 45 AI responses per day across Chat with The Bible and Explore Mode.",
      "Monthly limits reset each billing month. Unused included subscription messages do not roll over.",
      "Example: On Pro, if you use 100 AI messages in Chat with The Bible and 300 AI messages in Explore Mode, you have used all 400 monthly AI messages.",
    ],
  },
  {
    title: "Extra Messages",
    paragraphs: [
      "Extra Messages are a one-time in-app purchase, not a subscription.",
      "One Extra Message Pack adds 200 AI messages for $10.",
      "Extra Messages can be used after you reach your daily or monthly AI message limit.",
      "When your daily or monthly subscription limit resets, your included subscription messages are used first. Extra Messages are used after your included subscription messages are used.",
      "Extra Messages do not expire.",
      "Extra Messages do not reset or disappear when your billing period resets.",
      "If your subscription ends, unused Extra Messages remain available until used.",
    ],
  },
  {
    title: "Billing, Cancellation, and Refunds",
    paragraphs: [
      "Apple handles App Store billing, renewals, cancellations, and refunds.",
      "You can manage or cancel your subscription through your Apple Account subscription settings.",
      "Refund requests are handled by Apple at reportaproblem.apple.com.",
    ],
  },
  {
    title: "Restore Purchases",
    paragraphs: [
      "Use Restore Purchases in Den to restore eligible App Store purchases made with your Apple Account.",
    ],
  },
  {
    title: "Support",
    paragraphs: [`Contact: ${CONTACT_EMAIL}`],
  },
];

type TermsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function hasTermsForwardTransitionParam(
  searchParams: Record<string, string | string[] | undefined> | undefined,
) {
  const value = searchParams?.[LEGAL_TRANSITION_SEARCH_PARAM];

  return Array.isArray(value)
    ? value.includes(TERMS_FORWARD_TRANSITION)
    : value === TERMS_FORWARD_TRANSITION;
}

export default async function TermsPage({ searchParams }: TermsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const animateFromLanding = hasTermsForwardTransitionParam(resolvedSearchParams);

  return (
    <main
      className={`privacy-shell privacy-shell--terms${animateFromLanding ? " privacy-shell--from-landing" : ""}`}
      id="top"
    >
      <LegalPageClient cleanTransitionParam={animateFromLanding} />
      <div aria-hidden="true" className="privacy-blur privacy-blur-top" />
      <div aria-hidden="true" className="privacy-blur privacy-blur-bottom" />

      <div className="privacy-fixed-bar">
        <div className="privacy-fixed-inner">
          <div className="privacy-title-row">
            <LegalBackButton />

            <div className="privacy-title-copy">
              <h1>
                Den Usage &amp; <span className="terms-title-keep">Billing Terms</span>
              </h1>
            </div>
          </div>
          <p className="privacy-date">Last updated: June 5, 2026</p>
        </div>
      </div>

      <div className="privacy-inner">
        <article className="privacy-card">
          <section className="privacy-section">
            <h2>Overview</h2>
            <div className="privacy-prose">
              <p>
                These Usage &amp; Billing Terms explain Den subscriptions, AI message limits, and
                Extra Message purchases.
              </p>
              <p>
                Den uses Apple&apos;s Standard End User License Agreement. These Usage &amp;
                Billing Terms explain Den&apos;s app specific subscription and AI message rules.
              </p>
              <p>
                Apple Standard EULA:{" "}
                <a
                  className="privacy-link"
                  href={APPLE_STANDARD_EULA_URL}
                  rel="noreferrer"
                  target="_blank"
                >
                  {APPLE_STANDARD_EULA_URL}
                </a>
              </p>
              <p>
                Privacy Policy:{" "}
                <a className="privacy-link" href="/privacy">
                  {PRIVACY_POLICY_URL}
                </a>
              </p>
            </div>
          </section>

          {termsSections.map((section) => (
            <section className="privacy-section" key={section.title}>
              <h2>{section.title}</h2>
              <div className="privacy-prose">
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>
                    {section.title === "Support" ? (
                      <>
                        Contact:{" "}
                        <a className="privacy-link" href={`mailto:${CONTACT_EMAIL}`}>
                          {CONTACT_EMAIL}
                        </a>
                      </>
                    ) : (
                      paragraph
                    )}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="privacy-bullets">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
