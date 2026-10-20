import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-content flex-col items-start justify-center px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-accent-coral">
        {"// 404"}
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink md:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-sm text-muted-teal">
        This route does not exist. Head back to the homepage or start a project
        order.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
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
