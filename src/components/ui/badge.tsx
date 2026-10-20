import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-block border border-dark-border px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest text-muted-teal",
        className,
      )}
      {...props}
    />
  );
}
