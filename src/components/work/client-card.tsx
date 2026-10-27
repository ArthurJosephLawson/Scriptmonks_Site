import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CardInteractive } from "@/components/ui/card";
import { STATUS_LABELS, clientLine } from "@/lib/work";
import type { ProjectEntry } from "@/types/project";

export function ClientCard({ project }: { project: ProjectEntry }) {
  const meta = [clientLine(project), project.year].filter(Boolean).join(" · ");

  return (
    <CardInteractive className="flex h-full flex-col p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge className="shrink-0 whitespace-nowrap">[ {STATUS_LABELS[project.status]} ]</Badge>
        {meta ? (
          <span className="min-w-0 font-mono text-xs uppercase tracking-widest text-muted-teal">
            {meta}
          </span>
        ) : null}
      </div>
      <h3 className="mt-4 text-lg font-bold tracking-tight text-ink">
        <Link
          href={`/work/${project.slug}`}
          className="transition hover:text-accent-coral focus-visible:text-accent-coral"
        >
          {project.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted-teal">{project.summary}</p>
      {project.stack.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      ) : null}
    </CardInteractive>
  );
}
