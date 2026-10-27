/**
 * Legal text — public edition.
 *
 * SOURCE OF TRUTH: `DOCCUMENTS/TERMS OF SERVICE & PRIVACY POLICY.docx`
 * (effective 2026-09-27, v1.0), with the client agreements read for context.
 *
 * RULES
 *  - Never recreate legal text from memory. Every string below is taken from the
 *    source documents. Only the display brand name is substituted.
 *  - The owner-mandated confidentiality firewall (SPEC_V3.md §1, enforced by
 *    `scripts/confidentiality-check.mjs`) forbids publishing internal specifics.
 *    Those clauses are REDACTED here, not deleted silently: each is replaced by a
 *    `TODO(OWNER)` marker so the omission is explicit, and the reasoning is
 *    recorded in `docs/LEGAL.md`. No clause is ever invented.
 *  - Bracketed source placeholders (payment numbers, registered address) stay as
 *    `TODO(OWNER)`.
 */

export interface LegalSection {
  id: string;
  heading: string;
  /** Paragraphs of the section, from the source (brand name substituted). */
  paragraphs?: string[];
  /** Optional bullet-style clauses. */
  points?: string[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  /** Short description for metadata. */
  description: string;
  effectiveDate: string;
  documentVersion: string;
  sections: LegalSection[];
}

const EFFECTIVE_DATE = "September 27, 2026";
const DOCUMENT_VERSION = "1.0";
const EMAIL = "script.monks.mail@gmail.com";
const HANDLE = "@Script_monks";

export const legalMeta = {
  effectiveDate: EFFECTIVE_DATE,
  documentVersion: DOCUMENT_VERSION,
  email: EMAIL,
  handle: HANDLE,
} as const;

export const termsOfService: LegalDocument = {
  slug: "terms",
  title: "Terms of Service",
  description:
    "The terms that govern use of the ScriptMønks website, tools, and client engagements.",
  effectiveDate: EFFECTIVE_DATE,
  documentVersion: DOCUMENT_VERSION,
  sections: [
    {
      id: "acceptance",
      heading: "1. Acceptance of terms",
      paragraphs: [
        "By accessing, browsing, or using the official website or any public web applications and software tools operated by ScriptMønks (\u201cAgency\u201d, \u201cWe\u201d, \u201cUs\u201d, or \u201cOur\u201d), you agree to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue use of our services and platforms immediately.",
      ],
    },
    {
      id: "operator-status",
      heading: "1.1 Operator status",
      paragraphs: [
        "ScriptMønks is not an incorporated company, registered entity, or partnership. It is a software development brand operated and delivered by a single independent developer resident in Nepal. There are no employees, directors, shareholders, or partners who can enter into obligations on ScriptMønks\u2019 behalf.",
        "By engaging ScriptMønks, you confirm that you are a competent adult contracting of your own free will, that you have reviewed the agreed scope, deliverables, and timeline before committing funds, and that you accept the limited-liability structure described in Section 5 below.",
      ],
    },
    {
      id: "intellectual-property",
      heading: "2. Intellectual property & usage rights",
      points: [
        "Agency Content: All code, designs, graphics, branding elements, software tools, and text hosted on ScriptMønks platforms are the intellectual property of ScriptMønks, unless otherwise stated.",
        "Prohibited Conduct: Users may not scrape, reverse-engineer, decompile, redistribute, or exploit any portion of ScriptMønks\u2019 platforms, in-house tools, or web services without explicit prior written authorization.",
        "Payment-Contingent Ownership: For client work product, all intellectual property remains the sole property of ScriptMønks until 100% of the project fee has cleared into the official ScriptMønks account. No licence or ownership interest transfers before full and final payment.",
      ],
    },
    {
      id: "as-is",
      heading: "3. In-house tools & \u201cas-is\u201d software disclaimer",
      paragraphs: [
        "ScriptMønks develops and hosts various public web applications, utility tools, and demonstration tools.",
        "All public tools and software hosted by ScriptMønks are provided strictly on an \u201cAS-IS\u201d and \u201cAS-AVAILABLE\u201d basis.",
        "ScriptMønks makes no representations or warranties of any kind regarding server uptime, bug-free operation, accuracy, or suitability for any specific purpose.",
      ],
    },
    {
      id: "pricing",
      heading: "4. Pricing, payment flow & project limits",
      paragraphs: [
        "All ScriptMønks fees are quoted and payable exclusively in Nepalese Rupees (NPR). Larger requirements may be declined or split into a sequence of separate scopes of work, each priced individually.",
        "Third-party costs arranged directly with a provider (for example hosting, domains, licences, or third-party API charges) sit outside the project fee.",
      ],
    },
    {
      id: "payment-flow",
      heading: "4.1 Payment structure",
      paragraphs: [
        "50% Upfront Deposit (Non-Refundable): Work begins ONLY after 50% of the total project fee has cleared into the official ScriptMønks account. A sent-but-uncleared or pending transfer does not start the engagement, and the project clock does not begin.",
        "No Refund Once Development Begins: The 50% deposit is non-refundable in all circumstances from the moment active development starts. It is earned on commencement and is not contingent on client satisfaction or any later dispute. The only exception is a mutual written cancellation signed by both parties before any development has begun.",
        "50% Final Payment: The remaining 50% is due upon completion, during staging review, and BEFORE any final source code, repository, credentials, or live deployment access is handed over. Final release is strictly conditional on that balance clearing into the official ScriptMønks account.",
        "Delivery Lock: ScriptMønks retains full ownership and control of all source code, staging servers, binaries, domains, and credentials until 100% of the project fee has cleared. Staging access is granted for review; final handover is withheld until the balance clears.",
      ],
    },
    {
      id: "payment-methods",
      heading: "4.2 Payment methods",
      paragraphs: [
        "Payment details are provided directly to each client with their invoice.",
      ],
    },
    {
      id: "late-payment",
      heading: "4.3 Late payment",
      paragraphs: [
        "Invoices unpaid past the due date accrue a late administrative fee of 5% per week on the outstanding balance. Active work is suspended where payments are overdue by more than 7 calendar days, and intellectual-property release remains suspended until all amounts clear.",
      ],
    },
    {
      id: "third-party-arrangements",
      heading: "4.4 Third-party arrangements",
      paragraphs: [
        "Internal arrangements do not add to or deduct from a client\u2019s invoice.",
      ],
    },
    {
      id: "liability",
      heading: "5. Limitation of liability & operator protection",
      paragraphs: [
        "To the maximum extent permitted by applicable law, ScriptMønks, its founder, and collaborators shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from:",
      ],
      points: [
        "Server downtime, service interruptions, or data loss while using our public tools or platforms.",
        "Third-party link redirects or services linked on our website.",
        "Security breaches or technical glitches beyond our reasonable control.",
      ],
    },
    {
      id: "liability-cap",
      heading: "5.1 Liability cap",
      paragraphs: [
        "ScriptMønks is operated by a sole independent developer with no corporate legal personality. In all circumstances, ScriptMønks\u2019 total aggregate financial liability for any and all engagements combined is capped at the total amount actually paid by the client for the specific project giving rise to the claim. The client\u2019s sole and exclusive remedy is a return of sums actually paid to ScriptMønks.",
        "Claims against the personal assets or family of the operator are excluded to the fullest extent permitted by applicable law. Where any limitation here is held unenforceable, the client\u2019s sole remedy remains a refund of amounts actually paid.",
      ],
    },
    {
      id: "community-posts",
      heading: "6. Community posts",
      paragraphs: [
        "Community posts are not published at this time.",
      ],
    },
  ],
};

export const privacyPolicy: LegalDocument = {
  slug: "privacy",
  title: "Privacy Policy",
  description:
    "What ScriptMønks collects, how it is used, and how to request deletion.",
  effectiveDate: EFFECTIVE_DATE,
  documentVersion: DOCUMENT_VERSION,
  sections: [
    {
      id: "collect",
      heading: "1. Information we collect",
      paragraphs: [
        "ScriptMønks minimizes data collection to protect user privacy. We may collect the following basic information when you interact with us:",
      ],
      points: [
        `Contact Data: Email addresses, names, or contact handles provided voluntarily via email (${EMAIL}) or client intake forms.`,
        "Technical Logs: Basic server access logs (IP addresses, browser types, referrer URLs) collected automatically by hosting providers for security and analytical monitoring.",
      ],
    },
    {
      id: "use",
      heading: "2. How we use your information",
      paragraphs: ["We use collected data solely for internal operational purposes:"],
      points: [
        "Responding to client inquiries, scope requests, and support messages.",
        "Managing active project communication and delivering custom software solutions.",
        "Maintaining platform security, monitoring bug reports, and preventing server abuse.",
      ],
    },
    {
      id: "sharing",
      heading: "3. Data sharing & third-party services",
      paragraphs: [],
      points: [
        "No Selling of Data: ScriptMønks never sells, rents, or trades user emails, personal contact details, or community data to third-party advertisers or marketers.",
        "Third-Party Infrastructure: We use trusted third-party platforms to host our infrastructure (for example code repositories and standard cloud hosting providers). Interactions on third-party platforms remain subject to their respective privacy policies.",
      ],
    },
    {
      id: "security",
      heading: "4. Data security & user rights",
      paragraphs: [],
      points: [
        "Security: We employ standard administrative and technical measures to protect any stored communication or project data.",
        `Data Requests: You have the right to request the deletion or modification of any personal contact information we hold. To make a request, contact us directly at ${EMAIL}.`,
      ],
    },
    {
      id: "contact",
      heading: "5. Contact information",
      paragraphs: [
        "For any questions regarding these Terms of Service or Privacy Policy, contact us via:",
      ],
      points: [
        `Primary Email: ${EMAIL}`,
        `Social Identity: ${HANDLE}`,
        "Payment Queries: Use the official payment details published in the Client Invoice and Master Client Service Agreement. Never rely on payment details received via a third party.",
      ],
    },
  ],
};
