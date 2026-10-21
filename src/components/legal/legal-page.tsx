import Link from "next/link";
import { SectionLabel } from "@/components/layout/section-label";
import type { LegalDocument } from "@/data/legal";

export interface LegalPageProps {
  document: LegalDocument;
  label: string;
}

/**
 * Shared renderer for the legal pages. Copy comes from `src/data/legal.ts`
 * (mirror of the source `.docx` documents); no legal text lives in JSX.
 */
export function LegalPage({ document: doc, label }: LegalPageProps) {
  return (
    <main className="mx-auto max-w-content px-4 py-16 sm:px-6 md:py-24">
      <SectionLabel>{label}</SectionLabel>
      <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-ink md:text-4xl">
        {doc.title}
      </h1>
      <p className="mt-4 max-w-prose text-pretty text-sm text-muted-teal">
        {doc.description}
      </p>

      <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border border-dark-border bg-dark-surface p-4 font-mono text-xs uppercase tracking-widest text-muted-teal">
        <div className="flex gap-2">
          <dt className="text-accent-coral">[ EFFECTIVE ]</dt>
          <dd>{doc.effectiveDate}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-accent-coral">[ VERSION ]</dt>
          <dd>{doc.documentVersion}</dd>
        </div>
      </dl>

      <nav
        aria-label="Contents"
        className="mt-10 border border-dark-border bg-dark-surface p-4"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-accent-coral">
          [ CONTENTS ]
        </p>
        <ol className="mt-3 flex flex-col gap-2">
          {doc.sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:text-accent-coral"
              >
                {section.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 flex max-w-prose flex-col gap-12">
        {doc.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="text-balance text-lg font-bold tracking-tight text-ink">
              {section.heading}
            </h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-pretty text-sm leading-relaxed text-muted-teal">
                {paragraph}
              </p>
            ))}
            {section.points ? (
              <ul className="mt-4 flex flex-col gap-3">
                {section.points.map((point) => (
                  <li key={point} className="flex gap-2 text-sm leading-relaxed text-muted-teal">
                    <span aria-hidden className="text-accent-coral">
                      {"> "}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <nav className="mt-16 flex flex-wrap gap-4 border-t border-dark-border pt-8">
        <Link
          href="/privacy"
          className="font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:text-accent-coral"
        >
          [ PRIVACY POLICY ]
        </Link>
        <Link
          href="/contact"
          className="font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:text-accent-coral"
        >
          [ CONTACT ]
        </Link>
      </nav>
    </main>
  );
}
