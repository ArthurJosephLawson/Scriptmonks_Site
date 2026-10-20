import { Badge } from "@/components/ui/badge";

export const STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "Rust",
  "Tauri",
  "FastAPI",
  "Node.js",
  "Python",
  "SQLite",
  "PostgreSQL",
] as const;

export function StackStrip() {
  return (
    <section aria-label="Stack" className="border-b border-dark-border">
      <div className="mx-auto flex max-w-content flex-wrap items-center gap-3 px-6 py-6">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-teal">
          [ STACK ]
        </span>
        {STACK.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </div>
    </section>
  );
}
