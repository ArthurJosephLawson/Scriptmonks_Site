"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

/**
 * Client shell for lazily-loaded chrome (SPEC_V4 §4 "JS cost"): the command
 * palette, scroll progress and boot splash never enter the server render and
 * arrive as separate chunks.
 *
 * Each `ssr: false` import MUST sit inside its own <Suspense> and MUST be a
 * SIBLING of the page subtree, never an ancestor of it. React answers a
 * `BailoutToCSR` (thrown by `next/dynamic`'s `ssr: false` wrapper during the
 * server render) by emitting `BAILOUT_TO_CLIENT_SIDE_RENDERING` for the whole
 * nearest Suspense boundary above the thrower. If the chrome wraps
 * `{children}`, that boundary is the document root and every page ships an
 * empty body. Keeping each piece of chrome in a sibling boundary that contains
 * nothing but the chrome leaves the page's own markup in the SSR HTML.
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
      {children}
      <Suspense fallback={null}>
        <BootSplash />
      </Suspense>
      <Suspense fallback={null}>
        <ScrollProgress />
      </Suspense>
      <Suspense fallback={null}>
        <CommandPaletteProvider />
      </Suspense>
    </>
  );
}
