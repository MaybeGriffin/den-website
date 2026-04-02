import type { Metadata } from "next";
import { Fragment } from "react";
import { loadPrivacyPolicy } from "@/lib/privacy-policy";
import PrivacyBackButton from "./privacy-back-button";
import PrivacyPageClient from "./privacy-page-client";

const CONTACT_EMAIL = "griffinbritt@denbible.com";
const THIRD_PARTY_SERVICES = [
  "Supabase (Auth / Database / Storage)",
  "OpenAI (AI Chat / Explore)",
  "API.Bible (Scripture Content)",
  "RevenueCat (Subscriptions)",
  "Superwall (Paywalls)",
  "Expo (Notifications)",
  "Apple (Billing / SMS)",
];

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Den.",
};

function renderRichText(text: string) {
  const parts = text.replace(/Â/g, "").split(/(\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

    if (!match) {
      return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
    }

    const [, label, href] = match;
    const isExternal = href.startsWith("http");

    return (
      <a
        key={`${href}-${index}`}
        className="privacy-link"
        href={href}
        rel={isExternal ? "noreferrer" : undefined}
        target={isExternal ? "_blank" : undefined}
      >
        {label}
      </a>
    );
  });
}

export default function PrivacyPage() {
  const policy = loadPrivacyPolicy();
  const changesSection = policy.sections.find(
    (section) => section.title === "Changes to This Privacy Policy",
  );
  const contactSection = policy.sections.find(
    (section) => section.title === "Contact Information",
  );
  const mainSections = policy.sections.filter(
    (section) =>
      section.title !== "Changes to This Privacy Policy" &&
      section.title !== "Contact Information",
  );

  return (
    <main className="privacy-shell" id="top">
      <PrivacyPageClient />
      <div aria-hidden="true" className="privacy-blur privacy-blur-top" />
      <div aria-hidden="true" className="privacy-blur privacy-blur-bottom" />

      <div className="privacy-fixed-bar">
        <div className="privacy-fixed-inner">
          <div className="privacy-title-row">
            <PrivacyBackButton />

            <div className="privacy-title-copy">
              <h1>{policy.title}</h1>
            </div>
          </div>
          <p className="privacy-date">Last updated: {policy.updated}</p>
        </div>
      </div>

      <div className="privacy-inner">
        <article className="privacy-card">
          {mainSections.map((section) => {
            if (section.title === "Device Permissions") {
              const intro = section.paragraphs[0];
              const permissions = section.paragraphs.slice(1, 4);
              const outro = section.paragraphs[4];

              return (
                <section className="privacy-section" key={section.title}>
                  <h2>{section.title}</h2>
                  <div className="privacy-prose">
                    {intro ? <p>{renderRichText(intro)}</p> : null}
                    <ul className="privacy-bullets">
                      {permissions.map((permission) => (
                        <li key={permission}>{renderRichText(permission)}</li>
                      ))}
                    </ul>
                    {outro ? <p className="privacy-note">{renderRichText(outro)}</p> : null}
                  </div>
                </section>
              );
            }

            if (section.title === "How We Share Information") {
              const notice = section.paragraphs.at(-1);
              const body = notice ? section.paragraphs.slice(0, -1) : section.paragraphs;

              return (
                <section className="privacy-section" key={section.title}>
                  <h2>{section.title}</h2>
                  <div className="privacy-prose">
                    {body.map((paragraph, index) => (
                      <p key={`${section.title}-${index}`}>{renderRichText(paragraph)}</p>
                    ))}
                    {notice ? (
                      <div className="privacy-notice">
                        <strong>Notice</strong>
                        <p>{renderRichText(notice)}</p>
                      </div>
                    ) : null}
                  </div>
                </section>
              );
            }

            if (section.title === "Third-Party Services") {
              return (
                <section className="privacy-section" key={section.title}>
                  <h2>{section.title}</h2>
                  <div className="privacy-prose">
                    {section.paragraphs[0] ? <p>{renderRichText(section.paragraphs[0])}</p> : null}
                    <div className="privacy-service-grid">
                      {THIRD_PARTY_SERVICES.map((service) => (
                        <div className="privacy-service-pill" key={service}>
                          {service}
                        </div>
                      ))}
                    </div>
                    {section.paragraphs.slice(1).map((paragraph, index) => (
                      <p key={`${section.title}-${index + 1}`}>{renderRichText(paragraph)}</p>
                    ))}
                  </div>
                </section>
              );
            }

            if (section.title === "Your Rights and Choices") {
              return (
                <section className="privacy-section" key={section.title}>
                  <h2>{section.title}</h2>
                  <div className="privacy-prose">
                    {section.paragraphs.slice(0, 2).map((paragraph, index) => (
                      <p key={`${section.title}-${index}`}>{renderRichText(paragraph)}</p>
                    ))}
                    <div className="privacy-request-card">
                      <span>Privacy Request</span>
                      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                    </div>
                  </div>
                </section>
              );
            }

            const isNestedInfoSection =
              section.title === "Information You Provide" ||
              section.title === "Information Collected Automatically";

            return (
              <section
                className={`privacy-section${isNestedInfoSection ? " privacy-section-nested" : ""}`}
                key={section.title}
              >
                <h2>{section.title}</h2>
                <div className="privacy-prose">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={`${section.title}-${index}`}>{renderRichText(paragraph)}</p>
                  ))}
                </div>
              </section>
            );
          })}

          <footer className="privacy-footer">
            <div className="privacy-footer-block">
              <h2>Changes</h2>
              {changesSection?.paragraphs[0] ? (
                <p>{renderRichText(changesSection.paragraphs[0])}</p>
              ) : null}
            </div>

            <div className="privacy-footer-block privacy-footer-contact">
              <h2>Contact</h2>
              {contactSection?.paragraphs[0] ? (
                <p>{renderRichText(contactSection.paragraphs[0])}</p>
              ) : null}
              <strong>James Griffin Britt</strong>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}
