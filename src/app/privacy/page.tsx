import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/layout/section-label";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What the ScriptMønks order and contact forms collect and how it is handled.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-content px-6 py-24">
      <SectionLabel>06_PRIVACY</SectionLabel>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
        Privacy
      </h1>

      <div className="mt-10 flex max-w-2xl flex-col gap-6 text-sm text-muted-teal">
        <p>
          The order and contact forms collect the fields shown: name, email,
          optional GitHub username and company, and the project brief. Submitted
          details are delivered by email to ScriptMønks. There are no analytics
          and no third-party trackers.
        </p>
        <p>
          Messages are delivered through Resend, the transactional email
          provider. No data is sold or shared for advertising.
        </p>
        <p>
          To request deletion of anything you have sent, email{" "}
          <a
            href={`mailto:${siteConfig.links.email}`}
            className="text-accent-coral transition hover:text-accent-coral-dim"
          >
            {siteConfig.links.email}
          </a>
          .
        </p>
        <p>
          <Link
            href="/contact"
            className="font-mono text-xs uppercase tracking-widest text-accent-coral transition hover:text-accent-coral-dim"
          >
            [ CONTACT ]
          </Link>
        </p>
      </div>
    </main>
  );
}
