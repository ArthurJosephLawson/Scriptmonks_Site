import type { Metadata } from "next";
import { ErrorView } from "@/components/error/error-view";

export const metadata: Metadata = {
  title: "503 — Temporarily unavailable",
  robots: { index: false, follow: false },
};

export default function Error503Page() {
  return (
    <ErrorView
      code={503}
      title="Temporarily unavailable"
      message="This part of the site is paused right now. Please try again later."
    />
  );
}
