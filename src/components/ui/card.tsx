import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border border-dark-border bg-dark-surface", className)}
      {...props}
    />
  );
}

export function CardInteractive({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border border-dark-border bg-dark-surface transition duration-150",
        "hover:-translate-x-[2px] hover:-translate-y-[2px] hover:border-accent-coral hover:shadow-brutal",
        "focus-within:-translate-x-[2px] focus-within:-translate-y-[2px] focus-within:border-accent-coral focus-within:shadow-brutal",
        className,
      )}
      {...props}
    />
  );
}
