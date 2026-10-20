import { cn } from "@/lib/utils";

export interface ProgressProps {
  step: number;
  total?: number;
  className?: string;
}

export function Progress({ step, total = 4, className }: ProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      aria-label={`Step ${step} of ${total}`}
      className={cn("w-full", className)}
    >
      <p className="font-mono text-xs uppercase tracking-widest text-muted-teal">
        STEP {String(step).padStart(2, "0")}/{String(total).padStart(2, "0")}
      </p>
      <div className="mt-2 flex gap-1" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 border",
              i < step ? "border-accent-coral bg-accent-coral" : "border-dark-border",
            )}
          />
        ))}
      </div>
    </div>
  );
}
