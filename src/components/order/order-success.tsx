import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site";

const NEXT_STEPS = [
  "01 Order received",
  "02 We reply by email.",
  "03 Proposal",
] as const;

export function OrderSuccess({ refId }: { refId: string }) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <p className="font-mono text-xs uppercase tracking-widest text-accent-coral">
        [ ORDER RECEIVED ]
      </p>
      <p className="font-mono text-2xl text-ink">{refId}</p>
      <p className="text-sm text-muted-teal">
        Keep this reference. We reply by email.
      </p>
      <ol className="flex flex-col gap-3">
        {NEXT_STEPS.map((stepLabel) => (
          <li
            key={stepLabel}
            className="font-mono text-xs uppercase tracking-widest text-muted-teal"
          >
            {stepLabel}
          </li>
        ))}
      </ol>
      <div className="mt-2 flex flex-wrap gap-4">
        <Button href="/">BACK HOME</Button>
        <Button
          href={siteConfig.links.github.company}
          variant="secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          VIEW GITHUB
        </Button>
      </div>
    </div>
  );
}
