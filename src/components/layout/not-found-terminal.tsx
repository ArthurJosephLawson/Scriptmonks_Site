"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMagnetic } from "@/lib/use-magnetic";

const HOME_LINES = [
  "> 404: page not found",
  "> commands: home, work, contact, help",
];

const ROUTES: Record<string, string> = {
  home: "/",
  work: "/work",
  contact: "/contact",
  help: "help",
};

interface Line {
  prompt: boolean;
  text: string;
}

export function NotFoundTerminal() {
  const [lines, setLines] = React.useState<Line[]>(
    HOME_LINES.map((text) => ({ prompt: false, text })),
  );
  const [input, setInput] = React.useState("");
  const [pendingHref, setPendingHref] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const magneticRef = useMagnetic<HTMLAnchorElement>();

  const run = (raw: string) => {
    const value = raw.trim().toLowerCase();
    setLines((current) => [...current, { prompt: true, text: raw }]);
    setInput("");
    if (!value) return;

    if (value === "help") {
      setLines((current) => [
        ...current,
        { prompt: false, text: "> home     go to the homepage" },
        { prompt: false, text: "> work     browse all work" },
        { prompt: false, text: "> contact  send us a message" },
      ]);
      return;
    }

    const href = ROUTES[value];
    if (href) {
      if (href === "help") return;
      setPendingHref(href);
      setLines((current) => [...current, { prompt: false, text: `> opening ${value}...` }]);
      return;
    }

    setLines((current) => [
      ...current,
      { prompt: false, text: `> unknown command: ${value}` },
      { prompt: false, text: '> type "help" for the command list' },
    ]);
  };

  return (
    <div className="w-full max-w-xl border border-dark-border bg-dark-surface shadow-brutal-muted">
      <div className="flex items-center gap-2 border-b border-dark-border px-4 py-2">
        <span aria-hidden className="size-2 rounded-none bg-accent-coral" />
        <span className="font-mono text-xs text-muted-teal">404.TERMINAL</span>
      </div>

      <div
        ref={(node) => {
          node?.scrollTo?.({ top: node.scrollHeight });
        }}
        className="max-h-64 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed text-muted-teal"
      >
        {lines.map((line, index) => (
          <p key={`${index}-${line.text}`} className={line.prompt ? "text-ink" : undefined}>
            {line.prompt ? <span className="text-accent-coral">$ </span> : null}
            {line.text}
          </p>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          run(input);
        }}
        className="flex items-center gap-2 border-t border-dark-border px-4 py-3"
      >
        <label htmlFor="not-found-input" className="text-accent-coral font-mono text-xs">
          $
        </label>
        <input
          ref={inputRef}
          id="not-found-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="home | work | contact | help"
          aria-label="404 terminal command"
          className="min-h-11 w-full bg-transparent font-mono text-xs text-ink outline-none placeholder:text-muted-teal"
        />
      </form>

      {pendingHref ? (
        <div className="border-t border-dark-border px-4 py-3">
          <Link
            ref={magneticRef}
            href={pendingHref}
            className="magnetic inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-widest text-accent-coral"
          >
            [ GO {pendingHref} ]
          </Link>
        </div>
      ) : null}

      <div className="border-t border-dark-border px-4 py-3">
        <Button href="/work">VIEW WORK</Button>
      </div>
    </div>
  );
}
