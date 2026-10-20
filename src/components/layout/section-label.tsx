import { cn } from "@/lib/utils";

export interface SectionLabelProps {
  children: string;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "font-mono text-xs uppercase tracking-widest text-accent-coral",
        className,
      )}
    >
      {"// "}
      {children}
    </p>
  );
}
