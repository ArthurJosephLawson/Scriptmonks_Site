import type { Metadata } from "next";
import { SectionLabel } from "@/components/layout/section-label";
import { PROCESS_STAGES } from "@/data/process";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Process",
  description:
    "The six-stage ScriptMønks client lifecycle: lead qualification to final transfer.",
};

export default function ProcessPage() {
  return (
    <main className="mx-auto max-w-content px-6 py-24">
      <SectionLabel>04_PROCESS</SectionLabel>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
        Process
      </h1>
      <p className="mt-4 max-w-2xl text-base text-muted-teal">
        Six stages from lead qualification to final transfer.
      </p>

      <ol className="mt-12 flex flex-col border-l border-dark-border">
        {PROCESS_STAGES.map((stage) => (
          <li key={stage.number} className="relative pb-10 pl-8 last:pb-0">
            <span
              aria-hidden
              className="absolute -left-[5px] top-1.5 size-2.5 bg-accent-coral"
            />
            <p className="font-mono text-xs uppercase tracking-widest text-accent-coral">
              {stage.number}
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-ink">
              {stage.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-teal">
              {stage.description}
            </p>
          </li>
        ))}
      </ol>

      <section className="mt-20" aria-labelledby="standards">
        <SectionLabel>ENGINEERING STANDARDS</SectionLabel>
        <h2 id="standards" className="mt-2 text-2xl font-bold tracking-tight text-ink">
          How we build
        </h2>
        <div className="mt-8 grid gap-px border border-dark-border bg-dark-border md:grid-cols-2">
          {siteConfig.principles.map((principle) => (
            <div key={principle} className="bg-dark-surface p-6">
              <h3 className="text-lg font-bold tracking-tight text-ink">
                {principle}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
