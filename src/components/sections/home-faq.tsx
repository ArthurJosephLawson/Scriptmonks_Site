import { SectionLabel } from "@/components/layout/section-label";
import { Accordion } from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/data/faq";
import Link from "next/link";

export function HomeFaq() {
  const items = FAQ_ITEMS.slice(0, 4);

  return (
    <section id="faq" className="defer-render border-b border-dark-border">
      <div className="mx-auto max-w-content px-6 py-24">
        <SectionLabel>05_FAQ</SectionLabel>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Questions
        </h2>
        <div className="mt-10">
          <Accordion items={items} />
        </div>
        <p className="mt-6">
          <Link
            href="/faq"
            className="font-mono text-xs uppercase tracking-widest text-accent-coral transition hover:text-accent-coral-dim"
          >
            [ FULL FAQ ]
          </Link>
        </p>
      </div>
    </section>
  );
}
