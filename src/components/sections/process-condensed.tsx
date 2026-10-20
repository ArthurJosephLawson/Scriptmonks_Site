import { SectionLabel } from "@/components/layout/section-label";
import { Button } from "@/components/ui/button";
import { PROCESS_STAGES } from "@/data/process";

export function ProcessCondensed() {
  return (
    <section id="process" className="border-b border-dark-border">
      <div className="mx-auto max-w-content px-6 py-24">
        <SectionLabel>03_PROCESS</SectionLabel>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
          How a project runs
        </h2>

        <ol className="mt-12 grid gap-px border border-dark-border bg-dark-border md:grid-cols-2">
          {PROCESS_STAGES.map((stage) => (
            <li key={stage.number} className="bg-dark-surface p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-accent-coral">
                {stage.number}
              </p>
              <h3 className="mt-2 text-lg font-bold tracking-tight text-ink">
                {stage.title}
              </h3>
              <p className="mt-2 text-sm text-muted-teal">{stage.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Button href="/process" variant="secondary">
            FULL PROCESS
          </Button>
        </div>
      </div>
    </section>
  );
}
