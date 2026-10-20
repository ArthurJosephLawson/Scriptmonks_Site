import type { Metadata } from "next";
import { ErrorView } from "@/components/error/error-view";

export const metadata: Metadata = {
  title: "403 — Access denied",
  robots: { index: false, follow: false },
};

export default function Error403Page() {
  return (
    <ErrorView
      code={403}
      title="Access denied"
      message="You don't have permission to view this page."
    />
  );
}
