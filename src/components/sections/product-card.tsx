"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CardInteractive } from "@/components/ui/card";
import { CommandBlock } from "@/components/ui/command-block";
import { lonewolfScreenshots } from "@/data/screenshots.generated";
import { STATUS_LABELS } from "@/lib/work";
import type { ProjectEntry } from "@/types/project";

function WindowChrome() {
  return (
    <div
      aria-hidden
      className="flex items-center gap-2 border-b border-dark-border bg-dark-raised px-4 py-3"
    >
      <span className="size-2.5 bg-dark-border" />
      <span className="size-2.5 bg-dark-border" />
      <span className="size-2.5 bg-dark-border" />
    </div>
  );
}

function GalleryHero({ project }: { project: ProjectEntry }) {
  const shot = project.gallery === "lonewolf" ? lonewolfScreenshots[0] : undefined;
  const [failed, setFailed] = useState(false);

  if (!shot || failed) return null;

  return (
    <div className="relative mt-6 aspect-video w-full overflow-hidden border border-dark-border">
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        sizes="(max-width: 768px) 100vw, 66vw"
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function ProductCard({ project }: { project: ProjectEntry }) {
  const link =
    project.links?.release ?? project.links?.repo ?? project.links?.npm;
  const showChrome = !project.install && project.kind !== "lab";

  return (
    <CardInteractive className="flex h-full flex-col">
      {showChrome ? <WindowChrome /> : null}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-2xl font-bold tracking-tight text-ink">
            <Link
              href={`/work/${project.slug}`}
              className="transition hover:text-accent-coral focus-visible:text-accent-coral"
            >
              {project.title}
            </Link>
          </h3>
          <Badge className="shrink-0 whitespace-nowrap">[ {STATUS_LABELS[project.status]} ]</Badge>
        </div>
        <p className="mt-3 text-sm text-muted-teal">{project.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        {project.gallery ? <GalleryHero project={project} /> : null}
        {project.install ? <CommandBlock command={project.install} /> : null}

        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex w-fit pt-6 font-mono text-xs uppercase tracking-widest text-accent-coral transition hover:text-accent-coral-dim"
          >
            [ VIEW ]
          </a>
        ) : null}
      </div>
    </CardInteractive>
  );
}
