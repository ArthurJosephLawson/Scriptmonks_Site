import { Button } from "@/components/ui/button";
import { AVAILABILITY_LABELS, siteConfig } from "@/data/site";
import { projects } from "@/data/portfolio";
import { TerminalStatus } from "@/components/sections/terminal-status";
import { WidgetBoundary } from "@/components/error/widget-boundary";
import { cn } from "@/lib/utils";

function AvailabilityPill() {
  const isClosed = siteConfig.availability === "closed";
  return (
    <p className="inline-flex items-center gap-2 border border-dark-border bg-dark-surface px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-muted-teal">
      <span
        aria-hidden
        className={cn(
          "size-2 rounded-none",
          isClosed ? "bg-accent-coral" : "animate-pulse-dot bg-status-ok",
        )}
      />
      {AVAILABILITY_LABELS[siteConfig.availability]}
    </p>
  );
}

export function Hero() {
  const [beforeScripts, afterScripts] = siteConfig.tagline.split("scripts");

  return (
    <section className="relative border-b border-dark-border">
      {/* Accent-following brand watermark (SPEC_V4 §3.1) — CSS mask, no PNG. */}
      <span
        aria-hidden
        className="brand-mask pointer-events-none absolute left-6 top-1/2 z-0 hidden h-[min(70vh,480px)] w-auto -translate-y-1/2 opacity-[0.06] md:block aspect-[186/351]"
      />
      <div className="relative z-10 mx-auto grid max-w-content gap-12 px-6 py-24 md:grid-cols-2 md:items-center md:py-32">
        <div>
          <AvailabilityPill />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-ink md:text-6xl">
            {beforeScripts}
            <span className="text-accent-coral">scripts</span>
            {afterScripts}
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-teal">{siteConfig.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/#work" variant="secondary">
              EXPLORE WORK
            </Button>
            <Button href="/order">ORDER PROJECT</Button>
          </div>
        </div>

        <WidgetBoundary label="terminal">
          <TerminalStatus
            projectsDelivered={siteConfig.deliveredClientCount}
            productsShipped={projects.filter((p) => p.kind === "product").length}
            acceptingOrders={siteConfig.availability !== "closed"}
          />
        </WidgetBoundary>
      </div>
    </section>
  );
}
