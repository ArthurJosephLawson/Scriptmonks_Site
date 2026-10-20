import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site";

export function ContactSuccess({ refId }: { refId: string }) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <p className="font-mono text-xs uppercase tracking-widest text-accent-coral">
        [ MESSAGE SENT ]
      </p>
      <p className="font-mono text-2xl text-ink">{refId}</p>
      <p className="text-sm text-muted-teal">
        Keep this reference. We reply by email.
      </p>
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
