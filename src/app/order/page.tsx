import type { Metadata } from "next";
import Link from "next/link";
import { OrderWizard } from "@/components/order/order-wizard";
import { SectionLabel } from "@/components/layout/section-label";

export const metadata: Metadata = {
  title: "Order a Project | Scriptmonks",
  description: "Scope your project and send Scriptmonks a order.",
};

const NEXT_STEPS = [
  "01 You submit",
  "02 We reply by email.",
  "03 Proposal",
] as const;

export default function OrderPage() {
  return (
    <main className="mx-auto max-w-content px-6 py-24">
      <div className="grid gap-12 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <aside className="md:sticky md:top-24 md:self-start">
          <SectionLabel>03_ORDER</SectionLabel>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Order a project
          </h1>
          <p className="mt-4 text-sm text-muted-teal">
            We reply by email. What happens after you hit submit:
          </p>
          <ol className="mt-6 flex flex-col gap-3">
            {NEXT_STEPS.map((stepLabel) => (
              <li
                key={stepLabel}
                className="font-mono text-xs uppercase tracking-widest text-muted-teal"
              >
                {stepLabel}
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-muted-teal">
            Prefer email?{" "}
            <a
              href="mailto:script.monks.mail@gmail.com"
              className="font-mono text-xs uppercase tracking-widest text-accent-coral hover:text-accent-coral-dim"
            >
              script.monks.mail@gmail.com
            </a>
          </p>
        </aside>

        <OrderWizard />
      </div>

      <p className="mt-12 font-mono text-xs uppercase tracking-widest text-muted-teal">
        <Link
          href="/privacy"
          className="text-accent-coral transition hover:text-accent-coral-dim"
        >
          [ PRIVACY ]
        </Link>
      </p>
    </main>
  );
}
