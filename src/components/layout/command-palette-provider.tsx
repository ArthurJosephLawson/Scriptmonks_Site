"use client";

import * as React from "react";
import { CommandPalette } from "@/components/command-palette/command-palette";

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
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
