"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/sections/product-card";
import { ClientCard } from "@/components/work/client-card";
import { projects } from "@/data/portfolio";
import {
  WORK_FILTERS,
  WORK_FILTER_LABELS,
  filterByKind,
  isWorkFilter,
} from "@/lib/work";

export function WorkBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawFilter = searchParams.get("filter") ?? undefined;
  const active = isWorkFilter(rawFilter) ? rawFilter : "all";
  const entries = filterByKind(projects, active);

  function select(filter: (typeof WORK_FILTERS)[number]) {
    router.replace(
      filter === "all" ? pathname : `${pathname}?filter=${filter}`,
      { scroll: false },
    );
  }

  return (
    <div className="mt-12">
      <div
        role="tablist"
        aria-label="Filter work by kind"
        className="flex flex-wrap gap-2"
      >
        {WORK_FILTERS.map((filter) => {
          const count =
            filter === "all"
              ? projects.length
              : projects.filter((p) => p.kind === filter).length;
          const selected = filter === active;
          return (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => select(filter)}
              className={
                selected
                  ? "border border-accent-coral bg-dark-surface px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-accent-coral"
                  : "border border-dark-border bg-dark-surface px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:border-accent-coral hover:text-accent-coral"
              }
            >
              [ {WORK_FILTER_LABELS[filter]} · {count} ]
            </button>
          );
        })}
      </div>

      {entries.length === 0 ? (
        <p className="mt-12 font-mono text-xs uppercase tracking-widest text-muted-teal">
          [ NO PROJECTS IN THIS CATEGORY ]
        </p>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((project) =>
            project.kind === "client" ? (
              <ClientCard key={project.slug} project={project} />
            ) : (
              <ProductCard key={project.slug} project={project} />
            ),
          )}
        </div>
      )}
    </div>
  );
}
