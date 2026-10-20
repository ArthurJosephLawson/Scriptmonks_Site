import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="defer-render border-b border-dark-border">
      <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
        <h2 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
          Have a project in mind?
        </h2>
        <Button href="/order">ORDER PROJECT</Button>
      </div>
    </section>
  );
}
