import Image from "next/image";
import type { Metadata } from "next";
import { SectionLabel } from "@/components/layout/section-label";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "ScriptMønks is a solo-founded independent software development house, digital agency and software incubator.",
};

const LINKS = [
  { href: siteConfig.links.github.company, label: "[ GITHUB · @Script_monks ]" },
  { href: siteConfig.links.github.dev, label: "[ DEV · @ArthurJosephLawson ]" },
  { href: siteConfig.links.instagram, label: "[ INSTAGRAM ]" },
  { href: `mailto:${siteConfig.links.email}`, label: "[ EMAIL ]" },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-content px-6 py-24">
      <SectionLabel>03_ABOUT</SectionLabel>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
        About
      </h1>

      <div className="mt-8">
        <Image src="/brand/logo-full.png" alt={siteConfig.name} width={598} height={114} className="h-9 w-auto" />
      </div>

      <div className="mt-12 flex flex-col gap-6 border border-dark-border bg-dark-surface p-8 md:flex-row md:items-center">
        <span
          aria-hidden
          className="flex size-20 shrink-0 items-center justify-center border border-dark-border font-mono text-xl font-bold tracking-widest text-accent-coral"
        >
          [ AJL ]
        </span>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-ink">
            {siteConfig.founder.name}
          </h2>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-teal">
            ({siteConfig.founder.alias}) · {siteConfig.founder.role}
          </p>
          <p className="mt-4 max-w-2xl text-sm text-muted-teal">
            An independent software development house, digital agency and
            software incubator. The studio runs a hybrid model: client work plus
            proprietary products. The engineering standards are clean code
            architecture, scalable system design, modular development, and
            automated deployment setups.
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-px border border-dark-border bg-dark-border md:grid-cols-2">
        <div className="bg-dark-surface p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-accent-coral">
            [ CLIENT SERVICES ]
          </p>
          <p className="mt-3 text-sm text-muted-teal">
            Client work provides cash flow.
          </p>
        </div>
        <div className="bg-dark-surface p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-accent-coral">
            [ IN-HOUSE PRODUCTS ]
          </p>
          <p className="mt-3 text-sm text-muted-teal">
            Proprietary products build equity and brand authority.
          </p>
        </div>
      </div>

      <section className="mt-12" aria-labelledby="open-source">
        <SectionLabel>OPEN SOURCE</SectionLabel>
        <h2 id="open-source" className="sr-only">
          Open source
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          <li className="font-mono text-xs uppercase tracking-widest text-muted-teal">
            Wolf · MIT ·{" "}
            <a
              href="https://github.com/ArthurJosephLawson/Wolf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-coral transition hover:text-accent-coral-dim"
            >
              [ REPO ]
            </a>
          </li>
          <li className="font-mono text-xs uppercase tracking-widest text-muted-teal">
            DeployMonk · MIT ·{" "}
            <a
              href="https://github.com/ArthurJosephLawson/deploymonk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-coral transition hover:text-accent-coral-dim"
            >
              [ REPO ]
            </a>
          </li>
        </ul>
      </section>

      <ul className="mt-12 flex flex-wrap gap-4">
        {LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:text-accent-coral"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
