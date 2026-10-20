"use client";

import dynamic from "next/dynamic";

/**
 * Client shell for lazily-loaded chrome (SPEC_V4 §4 "JS cost"): the command
 * palette, scroll progress and boot splash never enter the server render and
 * arrive as separate chunks.
 */
const CommandPaletteProvider = dynamic(
  () =>
    import("@/components/layout/command-palette-provider").then(
      (mod) => mod.CommandPaletteProvider,
    ),
  { ssr: false },
);

const ScrollProgress = dynamic(
  () => import("@/components/layout/scroll-progress").then((mod) => mod.ScrollProgress),
  { ssr: false },
);

const BootSplash = dynamic(
  () => import("@/components/boot-splash").then((mod) => mod.BootSplash),
  { ssr: false },
);

export function LazyChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BootSplash />
      <CommandPaletteProvider>
        <ScrollProgress />
        {children}
      </CommandPaletteProvider>
    </>
  );
}
