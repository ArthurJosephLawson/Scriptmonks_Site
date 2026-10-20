import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, error, id, ...props }, ref) {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          className={cn(
            "w-full resize-y border bg-dark-surface px-4 py-3 font-mono text-sm text-ink",
            "placeholder:text-muted-teal/60",
            "focus:border-accent-coral focus:outline-none",
            error ? "border-red-400" : "border-dark-border",
            className,
          )}
          {...props}
        />
        {error ? (
          <p aria-live="polite" className="mt-1 font-mono text-xs text-red-400">
            ! {error}
          </p>
        ) : null}
      </div>
    );
  },
);
