import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { privacyPolicy } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy",
  description: privacyPolicy.description,
};

export default function PrivacyPage() {
  return <LegalPage document={privacyPolicy} label="08_PRIVACY" />;
}
