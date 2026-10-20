import { BootSplash } from "@/components/boot-splash";
import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { DotMatrix } from "@/components/layout/dot-matrix";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { CommandPaletteProvider } from "@/components/layout/command-palette-provider";
import { ToastProvider } from "@/components/toast/toast-provider";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { siteConfig } from "@/data/site";
import "./globals.css";

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const fontSans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ScriptMønks | Software House & Digital Agency",
    template: "%s | ScriptMønks",
  },
  description: siteConfig.description,
  keywords: ["ScriptMønks", "Scriptmonks", "Script Monks", "software house", "digital agency"],
  openGraph: {
    title: {
      default: "ScriptMønks | Software House & Digital Agency",
      template: "%s | ScriptMønks",
    },
    description: siteConfig.description,
    url: siteUrl,
    siteName: "ScriptMønks",
    locale: "en",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "ScriptMønks | Software House & Digital Agency",
      template: "%s | ScriptMønks",
    },
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontMono.variable} ${fontSans.variable}`}>
      <body>
        <BootSplash />
        <CommandPaletteProvider>
          <ToastProvider>
            <ScrollProgress />
            <DotMatrix />
            <Navbar />
            {children}
            <Footer />
          </ToastProvider>
        </CommandPaletteProvider>
      </body>
    </html>
  );
}
