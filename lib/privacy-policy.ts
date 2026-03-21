import { readFileSync } from "node:fs";
import path from "node:path";

const SECTION_TITLES = new Set([
  "Introduction",
  "Information We Collect",
  "Information You Provide",
  "Information Collected Automatically",
  "Device Permissions",
  "How We Use Information",
  "Legal Bases for Processing",
  "How We Share Information",
  "Third-Party Services",
  "Analytics, Tracking, and Advertising",
  "AI Features and User Content",
  "Payments and Subscriptions",
  "Data Retention",
  "Data Security",
  "Your Rights and Choices",
  "Account Deletion and Data Deletion",
  "Children’s Privacy",
  "International Data Transfers",
  "Changes to This Privacy Policy",
  "Contact Information",
]);

type PrivacySection = {
  title: string;
  paragraphs: string[];
};

export type PrivacyPolicy = {
  title: string;
  updated: string;
  sections: PrivacySection[];
};

function pushParagraph(buffer: string[], into: string[]) {
  const paragraph = buffer.join(" ").trim();
  if (paragraph) {
    into.push(paragraph);
  }
  buffer.length = 0;
}

export function loadPrivacyPolicy(): PrivacyPolicy {
  const filePath = path.join(process.cwd(), "content", "legal", "PrivacyPolicy.md");
  const raw = readFileSync(filePath, "utf8")
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .trim();

  const lines = raw.split("\n");
  const title = lines[0]?.trim() || "Privacy Policy";
  const updatedLine =
    lines.find((line) => line.startsWith("Last updated:")) || "Last updated:";
  const updated = updatedLine.replace("Last updated:", "").trim();

  const startIndex = lines.indexOf(updatedLine) + 1;
  const sections: PrivacySection[] = [];
  let currentSection: PrivacySection = {
    title: "Overview",
    paragraphs: [],
  };
  const paragraphBuffer: string[] = [];

  for (const rawLine of lines.slice(startIndex)) {
    const line = rawLine.trim();

    if (!line) {
      pushParagraph(paragraphBuffer, currentSection.paragraphs);
      continue;
    }

    if (SECTION_TITLES.has(line)) {
      pushParagraph(paragraphBuffer, currentSection.paragraphs);
      if (currentSection.paragraphs.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line,
        paragraphs: [],
      };
      continue;
    }

    paragraphBuffer.push(line);
  }

  pushParagraph(paragraphBuffer, currentSection.paragraphs);
  if (currentSection.paragraphs.length > 0) {
    sections.push(currentSection);
  }

  return {
    title,
    updated,
    sections,
  };
}
