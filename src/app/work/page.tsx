import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionLabel } from "@/components/layout/section-label";
import { WorkBrowser } from "@/components/work/work-browser";

export const metadata: Metadata = {
  title: "All Work | Scriptmonks",
  description:
    "Client work, in-house products, private systems and lab builds by Scriptmonks.",
};

export default function WorkPage() {
  return (
    <main className="mx-auto max-w-content px-6 py-24">
      <SectionLabel>02_WORK</SectionLabel>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
        All work
      </h1>
      <Suspense
        fallback={
          <p className="mt-12 font-mono text-xs uppercase tracking-widest text-muted-teal">
            [ LOADING ]
          </p>
        }
      >
        <WorkBrowser />
      </Suspense>
    </main>
  );
}
