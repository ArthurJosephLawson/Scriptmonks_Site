"use client";

import * as React from "react";
import { CommandPalette } from "@/components/command-palette/command-palette";

/**
 * Owns the command-palette open state and listens for the global
 * `sm:command-palette-open` event. Intentionally does not wrap the page: it
 * provides no context, so LazyChrome renders it as a sibling of `{children}`
 * (see lazy-chrome.tsx for why it must not be an ancestor).
 */
export function CommandPaletteProvider({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("sm:command-palette-open", onOpen);
    return () => window.removeEventListener("sm:command-palette-open", onOpen);
  }, []);

  return (
    <>
      {children}
      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  );
}
