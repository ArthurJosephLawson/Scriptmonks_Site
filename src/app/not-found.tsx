import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NotFoundTerminal } from "@/components/layout/not-found-terminal";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-content flex-col items-start justify-center gap-8 px-6 py-24">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-accent-coral">
          {"// 404"}
        </p>
        <h1
          id="page-title"
          tabIndex={-1}
          className="mt-4 text-3xl font-bold tracking-tight text-ink md:text-4xl"
        >
          Page not found
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted-teal">
          This route does not exist. Use the terminal, head back to the
          homepage, or start a project order.
        </p>
      </div>

      <NotFoundTerminal />

      <div className="flex flex-wrap gap-4">
        <Button href="/">BACK HOME</Button>
        <Button href="/order" variant="secondary">
          ORDER PROJECT
        </Button>
      </div>

      <Link
        href="/"
        className="sr-only focus:not-sr-only mt-4 font-mono text-xs text-accent-coral"
      >
        Skip to homepage
      </Link>
    </main>
  );
}
