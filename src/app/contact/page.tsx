import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/layout/section-label";
import { ContactForm } from "@/components/contact/contact-form";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact | Scriptmonks",
  description: "Contact Scriptmonks about a project or a question.",
};

const CONNECT = [
  { href: `mailto:${siteConfig.links.email}`, label: `[ EMAIL · ${siteConfig.links.email} ]` },
  { href: siteConfig.links.github.company, label: "[ GITHUB · @Script_monks ]" },
  { href: siteConfig.links.github.dev, label: "[ DEV · @ArthurJosephLawson ]" },
  { href: siteConfig.links.instagram, label: "[ INSTAGRAM ]" },
];

export default async function ContactPage() {
  const initialKind = "general";

  return (
    <main className="mx-auto max-w-content px-6 py-24">
      <SectionLabel>07_CONTACT</SectionLabel>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
        Contact
      </h1>

      <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <div>
          <ContactForm initialKind={initialKind} key={initialKind} />
        </div>

        <aside className="border border-dark-border bg-dark-surface p-6 h-fit">
          <p className="font-mono text-xs uppercase tracking-widest text-accent-coral">
            [ CONNECT ]
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {CONNECT.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:text-accent-coral"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <p className="mt-12 font-mono text-xs uppercase tracking-widest text-muted-teal">
        <Link
          href="/privacy"
          className="text-accent-coral transition hover:text-accent-coral-dim"
        >
          [ PRIVACY ]
        </Link>
      </p>
    </main>
  );
}
