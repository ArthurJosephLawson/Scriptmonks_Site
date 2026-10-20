"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ScreenshotItem {
  src: string;
  caption: string;
  alt: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ScreenshotGallery({ screenshots }: { screenshots: ScreenshotItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i - 1 + screenshots.length) % screenshots.length,
      ),
    [screenshots.length],
  );
  const next = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i + 1) % screenshots.length,
      ),
    [screenshots.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        prev();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
        return;
      }
      if (event.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(FOCUSABLE),
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousActive = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousActive?.focus?.();
    };
  }, [openIndex, close, prev, next]);

  if (screenshots.length === 0) {
    return (
      <div
        className="flex aspect-video w-full items-center justify-center border border-dashed border-dark-border bg-dark"
        role="status"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-muted-teal">
          [ SCREENSHOTS COMING SOON ]
        </span>
      </div>
    );
  }

  const open = openIndex === null ? null : screenshots[openIndex];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {screenshots.map((shot, index) => (
          <figure key={shot.src} className="border border-dark-border bg-dark-surface p-2">
            <button
              type="button"
              onClick={() => {
                setOpenIndex(index);
              }}
              className="relative block aspect-video w-full overflow-hidden transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-coral"
              aria-label={`Open screenshot: ${shot.caption}`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
            </button>
            <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-widest text-muted-teal">
              {shot.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={open.caption}
            className="w-full max-w-4xl border border-dark-border bg-dark-surface p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-teal">
                {openIndex !== null ? `${openIndex + 1} / ${screenshots.length}` : ""}
              </p>
              <button
                type="button"
                onClick={close}
                className="border border-dark-border px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-ink transition hover:border-accent-coral hover:text-accent-coral"
              >
                [ CLOSE ]
              </button>
            </div>
            <div className="relative mt-4 aspect-video w-full overflow-hidden border border-dark-border">
              <Image
                src={open.src}
                alt={open.alt}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={prev}
                className={cn(
                  "border border-dark-border px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-ink transition",
                  "hover:border-accent-coral hover:text-accent-coral",
                )}
                aria-label="Previous screenshot"
              >
                [ ← PREV ]
              </button>
              <p className="font-mono text-xs uppercase tracking-widest text-ink">
                {open.caption}
              </p>
              <button
                type="button"
                onClick={next}
                className={cn(
                  "border border-dark-border px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-ink transition",
                  "hover:border-accent-coral hover:text-accent-coral",
                )}
                aria-label="Next screenshot"
              >
                [ NEXT → ]
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
