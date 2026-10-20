"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface AccordionItemData {
  id: string;
  question: string;
  answer: string;
  link?: { href: string; label: string };
}

export function Accordion({ items }: { items: AccordionItemData[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="border border-dark-border">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id} className="border-b border-dark-border last:border-b-0">
            <h3>
              <button
                type="button"
                id={`${item.id}-button`}
                aria-expanded={open}
                aria-controls={`${item.id}-panel`}
                onClick={() => setOpenId(open ? null : item.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 px-5 py-4 text-left",
                  "font-mono text-xs uppercase tracking-widest transition",
                  open ? "text-accent-coral" : "text-ink hover:text-accent-coral",
                )}
              >
                {item.question}
                <span aria-hidden className="text-accent-coral">
                  {open ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={`${item.id}-panel`}
              role="region"
              aria-labelledby={`${item.id}-button`}
              hidden={!open}
              className="px-5 pb-5 text-sm text-muted-teal"
            >
              <p>{item.answer}</p>
              {item.link ? (
                <Link
                  href={item.link.href}
                  className="mt-2 inline-flex font-mono text-xs uppercase tracking-widest text-accent-coral transition hover:text-accent-coral-dim"
                >
                  [ {item.link.label.toUpperCase()} ]
                </Link>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
