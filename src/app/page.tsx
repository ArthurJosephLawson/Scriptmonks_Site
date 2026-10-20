import { AboutTeaser } from "@/components/sections/about-teaser";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { HomeFaq } from "@/components/sections/home-faq";
import { Portfolio } from "@/components/sections/portfolio";
import { ProcessCondensed } from "@/components/sections/process-condensed";
import { Services } from "@/components/sections/services";
import { StackStrip } from "@/components/sections/stack-strip";
import { siteConfig } from "@/data/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ScriptMønks",
  alternateName: ["Scriptmonks", "Script Monks"],
  url: siteUrl,
  description: siteConfig.description,
  email: siteConfig.links.email,
  sameAs: [
    siteConfig.links.instagram,
    siteConfig.links.github.company,
    siteConfig.links.github.dev,
  ],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <StackStrip />
      <Services />
      <ProcessCondensed />
      <Portfolio />
      <AboutTeaser />
      <HomeFaq />
      <CtaBand />
    </main>
  );
}
