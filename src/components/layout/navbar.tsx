"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { cn } from "@/lib/utils";

const WORK_MENU = [
  { href: "/work", label: "ALL WORK" },
  { href: "/work?filter=client", label: "CLIENT PROJECTS" },
  { href: "/work?filter=product", label: "PRODUCTS" },
  { href: "/work?filter=private", label: "PRIVATE BUILDS" },
  { href: "/work?filter=lab", label: "LABS" },
] as const;

function linkClass() {
  return "font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:text-accent-coral";
}

function subscribePlatform() {
  return () => {};
}

function getIsMac() {
  return /mac|iphone|ipad/i.test(navigator.userAgent);
}

function getIsMacServer() {
  return true;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);
  const isMac = useSyncExternalStore(subscribePlatform, getIsMac, getIsMacServer);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const workWrapperRef = useRef<HTMLDivElement>(null);
  const workButtonRef = useRef<HTMLButtonElement>(null);
  const workMenuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  const openPalette = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("sm:command-palette-open"));
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!workOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (!workWrapperRef.current?.contains(event.target as Node)) {
        setWorkOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setWorkOpen(false);
        workButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [workOpen]);

  function onWorkButtonKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setWorkOpen(true);
      window.setTimeout(() => {
        workMenuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
      }, 0);
    }
  }

  function onWorkMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const links = Array.from(
      workMenuRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
    );
    if (links.length === 0) return;
    const currentIndex = links.findIndex((link) => link === document.activeElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      links[(currentIndex + 1) % links.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      links[(currentIndex - 1 + links.length) % links.length]?.focus();
    } else if (event.key === "Tab" && !event.shiftKey && currentIndex === links.length - 1) {
      setWorkOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-dark-border bg-dark/80 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5" onClick={close} aria-label="ScriptMønks home">
          <Image src="/brand/logo-mark.png" alt="ScriptMønks" width={186} height={351} className="h-10 w-auto" priority />
          <span className="font-mono text-sm tracking-[0.2em] text-ink">
            scriptmønks
            <span aria-hidden className="animate-blink text-accent-coral">
              _
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          <Link href="/#services" className={linkClass()}>
            [ SERVICES ]
          </Link>
          <Link href="/#process" className={linkClass()}>
            [ PROCESS ]
          </Link>

          <div ref={workWrapperRef} className="relative">
            <button
              ref={workButtonRef}
              type="button"
              aria-expanded={workOpen}
              aria-haspopup="true"
              aria-controls="work-menu"
              onClick={() => setWorkOpen((value) => !value)}
              onKeyDown={onWorkButtonKeyDown}
              className={cn(linkClass(), "inline-flex items-center gap-1")}
            >
              [ WORK
              <span aria-hidden>▾</span> ]
            </button>
            {workOpen ? (
              <div
                ref={workMenuRef}
                id="work-menu"
                role="menu"
                aria-label="Work"
                onKeyDown={onWorkMenuKeyDown}
                className="absolute left-0 top-full z-50 mt-3 flex min-w-[16rem] flex-col border border-dark-border bg-dark-surface py-1"
              >
                {WORK_MENU.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setWorkOpen(false)}
                    className="px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:bg-dark-raised hover:text-accent-coral"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <Link href="/#about" className={linkClass()}>
            [ ABOUT ]
          </Link>
          <Link href="/contact" className={linkClass()}>
            [ CONTACT ]
          </Link>

          <button
            type="button"
            onClick={openPalette}
            className="hidden font-mono text-xs text-muted-teal transition hover:text-accent-coral lg:block"
            aria-label="Open command palette"
          >
            {isMac ? "[ ⌘K ]" : "[ CTRL K ]"}
          </button>

          <ThemeSwitcher />

          <Button href="/order">ORDER PROJECT</Button>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="border border-dark-border p-2 text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Primary mobile"
        className={cn(
          "border-t border-dark-border bg-dark-surface md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col gap-4 px-6 py-6">
          <div className="flex justify-start">
            <ThemeSwitcher />
          </div>
          <Link href="/#services" className={linkClass()} onClick={close}>
            [ SERVICES ]
          </Link>
          <Link href="/#process" className={linkClass()} onClick={close}>
            [ PROCESS ]
          </Link>

          <div className="flex flex-col gap-3">
            <Link href="/work" className={linkClass()} onClick={close}>
              [ WORK ]
            </Link>
            <div className="flex flex-col gap-3 border-l border-dark-border pl-4">
              {WORK_MENU.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkClass()}
                  onClick={close}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/#about" className={linkClass()} onClick={close}>
            [ ABOUT ]
          </Link>
          <Link href="/contact" className={linkClass()} onClick={close}>
            [ CONTACT ]
          </Link>
          <button
            type="button"
            aria-label="Command palette"
            className={cn(linkClass(), "self-start")}
          >
            {isMac ? "[ ⌘K ]" : "[ CTRL K ]"}
          </button>
          <Button href="/order" onClick={close}>
            ORDER PROJECT
          </Button>
        </div>
      </nav>
    </header>
  );
}
