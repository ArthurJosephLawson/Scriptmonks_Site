"use client";

import * as React from "react";
import { THEMES, themeById } from "@/lib/theme";
import { useTheme } from "@/components/layout/theme-provider";
import { cn } from "@/lib/utils";

function reducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/**
 * Navbar `[ THEME ]` switcher (SPEC_V4 §3.3).
 * `role="listbox"`, arrow-key navigation, Esc closes, Enter/Space selects.
 * Desktop hover/focus previews live; a commit persists. Preview is disabled
 * under reduced motion (commit only).
 */
export function ThemeSwitcher() {
  const { settings, setTheme, previewTheme, toggleCrt } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(() =>
    Math.max(0, THEMES.findIndex((theme) => theme.id === settings.theme)),
  );
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const active = themeById(settings.theme);

  const close = React.useCallback(
    (revert: boolean) => {
      if (revert) previewTheme(null);
      setOpen(false);
      buttonRef.current?.focus();
    },
    [previewTheme],
  );

  const commit = React.useCallback(
    (index: number) => {
      const theme = THEMES[index];
      if (!theme) return;
      setActiveIndex(index);
      setTheme(theme.id);
      previewTheme(null);
    },
    [setTheme, previewTheme],
  );

  React.useEffect(() => {
    if (!open) return;
    optionRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) close(true);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  function onOptionKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      const next = (index + 1) % THEMES.length;
      setActiveIndex(next);
      optionRefs.current[next]?.focus();
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      const prev = (index - 1 + THEMES.length) % THEMES.length;
      setActiveIndex(prev);
      optionRefs.current[prev]?.focus();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      commit(index);
      close(false);
    }
  }

  function focusOption(index: number, preview: boolean) {
    setActiveIndex(index);
    const theme = THEMES[index];
    if (theme && preview && !reducedMotion()) previewTheme(theme.id);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change accent theme"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center gap-2 px-2 font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:text-accent-coral"
      >
        <span
          aria-hidden
          className="size-2.5 rounded-none"
          style={{ backgroundColor: `rgb(${active.accent})` }}
        />
        [ THEME ]
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Accent theme"
          className="absolute right-0 top-full z-50 mt-3 flex w-56 flex-col border border-dark-border bg-dark-surface py-1 shadow-brutal-muted"
          onPointerLeave={() => previewTheme(null)}
        >
          {THEMES.map((theme, index) => (
            <button
              key={theme.id}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="option"
              aria-selected={theme.id === settings.theme}
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => {
                commit(index);
                close(false);
              }}
              onKeyDown={(event) => onOptionKeyDown(event, index)}
              onPointerEnter={() => focusOption(index, true)}
              onFocus={() => focusOption(index, true)}
              className={cn(
                "flex min-h-11 items-center gap-3 px-4 py-2 font-mono text-xs uppercase tracking-widest",
                theme.id === settings.theme
                  ? "bg-dark-raised text-accent-coral"
                  : "text-muted-teal hover:bg-dark-raised hover:text-accent-coral",
              )}
            >
              <span
                aria-hidden
                className="size-3 rounded-none border border-dark-border"
                style={{ backgroundColor: `rgb(${theme.accent})` }}
              />
              {theme.label}
            </button>
          ))}

          <div className="mt-1 flex flex-col border-t border-dark-border pt-1">
            <button
              type="button"
              role="switch"
              aria-checked={settings.crt}
              onClick={toggleCrt}
              className="flex min-h-11 items-center justify-between px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-teal hover:bg-dark-raised hover:text-accent-coral"
            >
              CRT SCANLINES
              <span aria-hidden>{settings.crt ? "[ ON ]" : "[ OFF ]"}</span>
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={reducedEffects()}
              onClick={() => document.documentElement.classList.toggle("reduce-effects")}
              className="flex min-h-11 items-center justify-between px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-teal hover:bg-dark-raised hover:text-accent-coral"
            >
              REDUCE EFFECTS
              <span aria-hidden>{reducedEffects() ? "[ ON ]" : "[ OFF ]"}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Reads the user's "reduce effects" preference (CSS class, no storage). */
function reducedEffects(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("reduce-effects");
}
