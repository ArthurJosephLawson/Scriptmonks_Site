import { SectionLabel } from "@/components/layout/section-label";
import { Badge } from "@/components/ui/badge";
import { CardInteractive } from "@/components/ui/card";
import { services } from "@/data/services";

export function Services() {
  return (
    <section id="services" className="border-b border-dark-border">
      <div className="mx-auto max-w-content px-6 py-24">
        <SectionLabel>01_SERVICES</SectionLabel>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
          What we build
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <CardInteractive key={service.index} className="p-6">
                <div className="flex items-start justify-between">
                  <Icon size={28} strokeWidth={1.5} aria-hidden className="text-accent-coral" />
                  <span className="font-mono text-xs tracking-widest text-muted-teal">
                    {service.index}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold tracking-tight text-ink">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-muted-teal">{service.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </CardInteractive>
            );
          })}
        </div>
      </div>
    </section>
  );
}
