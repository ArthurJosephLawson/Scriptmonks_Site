import Link from "next/link";
import Image from "next/image";
import { ScrollTopButton } from "@/components/layout/scroll-top-button";
import { currentYear, siteConfig } from "@/data/site";

const NAVIGATE = [
  { href: "/#services", label: "SERVICES" },
  { href: "/#process", label: "PROCESS" },
  { href: "/work", label: "WORK" },
  { href: "/#about", label: "ABOUT" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "CONTACT" },
  { href: "/privacy", label: "PRIVACY" },
] as const;

const CONNECT = [
  {
    href: siteConfig.links.github.company,
    label: "[ GITHUB · @Script_monks ]",
    external: true,
  },
  {
    href: siteConfig.links.github.dev,
    label: "[ DEV · @ArthurJosephLawson ]",
    external: true,
  },
  {
    href: siteConfig.links.instagram,
    label: "[ INSTAGRAM ]",
    external: true,
  },
  { href: `mailto:${siteConfig.links.email}`, label: "[ EMAIL ]", external: false },
] as const;

export function Footer() {
  const year = currentYear;

  return (
    <footer className="border-t border-dark-border">
      <div className="mx-auto max-w-content px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="flex items-center gap-3">
              <Image src="/brand/logo-full.png" alt="" width={598} height={114} className="w-44 opacity-90" />
              <span className="font-mono text-base font-bold tracking-tight text-ink">
                {siteConfig.name}
              </span>
            </p>
            <p className="mt-3 max-w-xs text-sm text-muted-teal">
              {siteConfig.tagline}
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="font-mono text-xs uppercase tracking-widest text-accent-coral">
              [ NAVIGATE ]
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {NAVIGATE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:text-accent-coral"
                  >
                    [ {link.label} ]
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent-coral">
              [ CONNECT ]
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {CONNECT.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:text-accent-coral"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-dark-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-muted-teal">
            © {year} {siteConfig.name}
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-teal">
            {siteConfig.footerNote}
          </p>
          <ScrollTopButton />
        </div>
      </div>
    </footer>
  );
}
