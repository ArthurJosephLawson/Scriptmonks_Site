import type { Metadata } from "next";
import { SectionLabel } from "@/components/layout/section-label";
import { Accordion } from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/data/faq";

export const metadata: Metadata = {
  title: "FAQ | Scriptmonks",
  description:
    "How Scriptmonks projects run, who you work with, code ownership, and what we build.",
};

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-content px-6 py-24">
      <SectionLabel>05_FAQ</SectionLabel>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
        FAQ
      </h1>
      <div className="mt-12 max-w-3xl">
        <Accordion items={FAQ_ITEMS} />
      </div>
    </main>
  );
}
