import type { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "inline-block font-mono text-xs uppercase tracking-widest text-muted-teal",
        className,
      )}
      {...props}
    />
  );
}
