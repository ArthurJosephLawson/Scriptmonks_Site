import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { termsOfService } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: termsOfService.description,
};

export default function TermsPage() {
  return <LegalPage document={termsOfService} label="07_TERMS" />;
}
