"use client";

import { useEffect, useRef } from "react";

const PREFIX_STATUS = "$ scriptmonks --status\n";
const PREFIX_PROJECTS = "> projects_delivered: ";
const PREFIX_PRODUCTS = "> products_shipped: ";
const PREFIX_ACCEPTING = "> accepting_orders: ";

export interface TerminalStatusProps {
  projectsDelivered: number;
  productsShipped: number;
  acceptingOrders: boolean;
}

function buildFullText({
  projectsDelivered,
  productsShipped,
  acceptingOrders,
}: TerminalStatusProps) {
  return [
    `${PREFIX_STATUS}${PREFIX_PROJECTS}${projectsDelivered}`,
    `${PREFIX_PRODUCTS}${productsShipped}`,
    `${PREFIX_ACCEPTING}${acceptingOrders}`,
  ].join("\n");
}

export function TerminalStatus(props: TerminalStatusProps) {
  const fullText = buildFullText(props);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = textRef.current;
    if (!node) return;
    node.textContent = "";
    let index = 0;
    const id = window.setInterval(() => {
      index += 1;
      node.textContent = fullText.slice(0, index);
      if (index >= fullText.length) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [fullText]);

  return (
    <div
      aria-label={fullText}
      className="border border-dark-border bg-dark-surface p-6 font-mono text-sm text-muted-teal"
    >
      <pre className="whitespace-pre-wrap">
        <span ref={textRef}>{fullText}</span>
        <span aria-hidden className="animate-blink text-accent-coral">
          _
        </span>
      </pre>
    </div>
  );
}
