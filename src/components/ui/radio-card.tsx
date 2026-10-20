import { cn } from "@/lib/utils";

export interface RadioCardProps<T extends string> {
  name: string;
  value: T;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: T) => void;
  className?: string;
}

export function RadioCard<T extends string>({
  name,
  value,
  label,
  hint,
  checked,
  onChange,
  className,
}: RadioCardProps<T>) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 border bg-dark-surface p-4 transition duration-150",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-coral",
        checked
          ? "border-accent-coral shadow-brutal-sm"
          : "border-dark-border hover:border-muted-teal",
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 font-mono text-xs",
          checked ? "text-accent-coral" : "text-muted-teal",
        )}
      >
        {checked ? "[ x ]" : "[   ]"}
      </span>
      <span className="min-w-0">
        <span className="block font-sans text-sm font-bold tracking-tight text-ink">
          {label}
        </span>
        {hint ? (
          <span className="mt-1 block font-sans text-sm text-muted-teal">{hint}</span>
        ) : null}
      </span>
    </label>
  );
}
