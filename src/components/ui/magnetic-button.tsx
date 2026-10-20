"use client";

import type { ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useMagnetic } from "@/lib/use-magnetic";

/**
 * Primary button with the SPEC_V4 §4 micro-interactions: a press translate and
 * a pointer "magnetic" pull capped at 6 px on desktop (no-op under reduced
 * motion or on touch input). Wrap anything that should feel primary.
 */
export function MagneticButton(props: ButtonProps & { children: ReactNode }) {
  const ref = useMagnetic<HTMLElement>();
  return <Button ref={ref as never} {...props} className={`magnetic ${props.className ?? ""}`} />;
}
