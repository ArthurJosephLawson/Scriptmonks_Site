import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, id, ...props },
  ref,
) {
  return (
    <div className="w-full">
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(
          "w-full border bg-dark-surface px-4 py-3 font-mono text-sm text-ink",
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
});
