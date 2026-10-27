import { projects } from "@/data/portfolio";
import { siteConfig } from "@/data/site";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function MetricsGrid() {
  const productCount = projects.filter((p) => p.kind === "product").length;
  const tiles = [
    { value: pad(siteConfig.deliveredClientCount), label: "Client projects delivered" },
    { value: pad(productCount), label: "Proprietary products" },
    { value: "SOLO", label: "Founder, direct line" },
    ...(siteConfig.extraMetric
      ? [{ value: siteConfig.extraMetric.value, label: siteConfig.extraMetric.label }]
      : []),
  ];

  return (
    <div
      className={`grid grid-cols-2 gap-px border border-dark-border bg-dark-border ${
        tiles.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3"
      }`}
    >
      {tiles.map((tile) => (
        <div key={tile.label} className="bg-dark-surface p-6 md:p-8">
          <p className="font-mono text-4xl font-bold tracking-tight text-ink md:text-5xl">
            {tile.value}
          </p>
          <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-teal">
            {tile.label}
          </p>
        </div>
      ))}
    </div>
  );
}
