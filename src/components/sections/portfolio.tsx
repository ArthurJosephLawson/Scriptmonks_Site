import { SectionLabel } from "@/components/layout/section-label";
import { Button } from "@/components/ui/button";
import { MetricsGrid } from "@/components/sections/metrics-grid";
import { ProductCard } from "@/components/sections/product-card";
import { ClientCard } from "@/components/work/client-card";
import { projects } from "@/data/portfolio";

const featured = projects.filter((p) => p.kind === "product" || p.kind === "private");
const clientEntries = projects.filter((p) => p.kind === "client");

export function Portfolio() {
  return (
    <section id="work" className="border-b border-dark-border">
      <div className="mx-auto max-w-content px-6 py-24">
        <SectionLabel>02_WORK</SectionLabel>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Track record
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {featured.map((project) => (
            <ProductCard key={project.slug} project={project} />
          ))}
        </div>

        <div className="mt-16">
          <MetricsGrid />
        </div>

        {clientEntries.length > 0 ? (
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {clientEntries.map((project) => (
              <ClientCard key={project.slug} project={project} />
            ))}
          </div>
        ) : null}

        <div className="mt-16">
          <Button href="/work" variant="secondary">
            VIEW ALL WORK
          </Button>
        </div>
      </div>
    </section>
  );
}
