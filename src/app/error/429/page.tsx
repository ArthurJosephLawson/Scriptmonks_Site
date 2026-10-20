import type { Metadata } from "next";
import { ErrorView } from "@/components/error/error-view";

export const metadata: Metadata = {
  title: "429 — Too many requests",
  robots: { index: false, follow: false },
};

export default function Error429Page() {
  return (
    <ErrorView
      code={429}
      title="Too many requests"
      message="You're going a little fast. Please wait a moment and try again."
    />
  );
}
