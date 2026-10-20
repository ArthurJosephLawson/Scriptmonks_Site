import { SectionLabel } from "@/components/layout/section-label";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site";

export function AboutTeaser() {
  return (
    <section id="about" className="border-b border-dark-border">
      <div className="mx-auto max-w-content px-6 py-24">
        <SectionLabel>04_ABOUT</SectionLabel>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
          One developer, direct line
        </h2>
        <p className="mt-6 max-w-2xl text-base text-muted-teal">
          ScriptMønks is a solo-founded independent software development house,
          digital agency and software incubator. It runs a hybrid model: client
          client work for cash flow, proprietary products for equity and brand
          authority.
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-teal">
          {siteConfig.founder.name} ({siteConfig.founder.alias}) ·{" "}
          {siteConfig.founder.role}
        </p>
        <div className="mt-10">
          <Button href="/about" variant="secondary">
            ABOUT
          </Button>
        </div>
      </div>
    </section>
  );
}
