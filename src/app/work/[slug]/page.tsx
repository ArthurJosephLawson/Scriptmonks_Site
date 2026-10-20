import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommandBlock } from "@/components/ui/command-block";
import { SectionLabel } from "@/components/layout/section-label";
import { ScreenshotGallery } from "@/components/work/screenshot-gallery";
import { WidgetBoundary } from "@/components/error/widget-boundary";
import { lonewolfScreenshots } from "@/data/screenshots.generated";
import { projects } from "@/data/portfolio";
import {
  STATUS_LABELS,
  clientLine,
  releaseLabel,
  suggestedType,
} from "@/lib/work";
import type { ProjectEntry } from "@/types/project";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Not Found" };
  return {
    title: `${project.title} | Work`,
    description: project.tagline,
    openGraph: {
      title: project.title,
      description: project.tagline,
    },
  };
}

function kindLabel(project: ProjectEntry): string {
  return project.kind.toUpperCase();
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const previous = index > 0 ? projects[index - 1] : undefined;
  const next = index < projects.length - 1 ? projects[index + 1] : undefined;
  const meta = [clientLine(project), project.year].filter(Boolean).join(" · ");

  return (
    <main className="mx-auto max-w-content px-6 py-24">
      <nav
        aria-label="Breadcrumb"
        className="font-mono text-xs uppercase tracking-widest text-muted-teal"
      >
        <Link href="/work" className="transition hover:text-accent-coral">
          WORK
        </Link>
        {" / "}
        <span>{kindLabel(project)}</span>
        {" / "}
        <span className="text-ink">{project.title.toUpperCase()}</span>
      </nav>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Badge>[ {STATUS_LABELS[project.status]} ]</Badge>
        {meta ? (
          <span className="font-mono text-xs uppercase tracking-widest text-muted-teal">
            {meta}
          </span>
        ) : null}
      </div>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink md:text-5xl">
        {project.title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-teal">{project.tagline}</p>

      {project.slug === "lonewolf" ? (
        <p
          role="note"
          className="mt-8 border border-dark-border bg-dark-surface p-4 font-mono text-xs uppercase tracking-widest text-muted-teal"
        >
          [ PRIVATE · CLOSED SOURCE ] This is ScriptMønks&apos; own system. It is
          not open source and there is no public repository.
        </p>
      ) : null}

      <p className="mt-10 max-w-2xl text-base text-muted-teal">{project.summary}</p>

      <section className="mt-10" aria-labelledby="highlights">
        <SectionLabel>02_HIGHLIGHTS</SectionLabel>
        <h2 id="highlights" className="sr-only">
          Highlights
        </h2>
        <ul className="mt-4 space-y-2">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="font-mono text-sm text-muted-teal">
              <span className="text-accent-coral" aria-hidden>
                {"> "}
              </span>
              {highlight}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="stack">
        <SectionLabel>03_STACK</SectionLabel>
        <h2 id="stack" className="sr-only">
          Stack
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </section>

      {project.links ? (
        <div className="mt-10 flex flex-wrap gap-4">
          {project.links.repo ? (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit font-mono text-xs uppercase tracking-widest text-accent-coral transition hover:text-accent-coral-dim"
            >
              [ VIEW ON GITHUB ]
            </a>
          ) : null}
          {project.links.release ? (
            <a
              href={project.links.release}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit font-mono text-xs uppercase tracking-widest text-accent-coral transition hover:text-accent-coral-dim"
            >
              {releaseLabel(project.links.release)}
            </a>
          ) : null}
          {project.links.npm ? (
            <a
              href={project.links.npm}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit font-mono text-xs uppercase tracking-widest text-accent-coral transition hover:text-accent-coral-dim"
            >
              [ NPM ]
            </a>
          ) : null}
        </div>
      ) : null}

      {project.install ? (
        <div className="mt-10 max-w-xl">
          <CommandBlock command={project.install} />
        </div>
      ) : null}

      {project.gallery === "lonewolf" ? (
        <section className="mt-12" aria-labelledby="screenshots">
          <SectionLabel>04_SCREENSHOTS</SectionLabel>
          <h2 id="screenshots" className="sr-only">
            Screenshots
          </h2>
          <div className="mt-6">
            <WidgetBoundary label="screenshot-gallery">
              <ScreenshotGallery screenshots={lonewolfScreenshots} />
            </WidgetBoundary>
          </div>
        </section>
      ) : null}

      {project.isPlaceholder && project.kind === "client" ? (
        <p className="mt-10 font-mono text-xs uppercase tracking-widest text-muted-teal">
          Project details simplified for client privacy.
        </p>
      ) : null}

      <div className="mt-12">
        <Button href={`/order?type=${suggestedType(project.slug)}`}>
          ORDER A SIMILAR PROJECT
        </Button>
      </div>

      <nav
        aria-label="More projects"
        className="mt-16 flex flex-wrap justify-between gap-4 border-t border-dark-border pt-8"
      >
        {previous ? (
          <Link
            href={`/work/${previous.slug}`}
            className="font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:text-accent-coral"
          >
            [ ← {previous.title.toUpperCase()} ]
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/work/${next.slug}`}
            className="font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:text-accent-coral"
          >
            [ {next.title.toUpperCase()} → ]
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
