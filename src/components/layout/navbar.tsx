"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

const WORK_MENU = [
  { href: "/work", label: "ALL WORK" },
  { href: "/work?filter=client", label: "CLIENT PROJECTS" },
  { href: "/work?filter=product", label: "PRODUCTS" },
  { href: "/work?filter=private", label: "PRIVATE BUILDS" },
  { href: "/work?filter=lab", label: "LABS" },
] as const;

const MORE_MENU = [
  { href: "/#about", label: "ABOUT" },
  { href: "/faq", label: "FAQ" },
] as const;

const FOLLOW_MENU = [
  { href: siteConfig.links.instagram, label: `INSTAGRAM · ${siteConfig.links.instagramHandle}` },
  { href: siteConfig.links.github.company, label: "GITHUB · @Script_monks" },
  { href: `mailto:${siteConfig.links.email}`, label: "EMAIL" },
] as const;

const SPY_SECTIONS = ["services", "process", "work", "about"] as const;

const HOVER_INTENT_MS = 120;

function linkClass(active = false) {
  return cn(
    "inline-flex min-h-12 items-center font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:text-accent-coral",
    active && "border-b-2 border-accent-coral text-accent-coral",
  );
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

function isSameRoute(href: string, pathname: string) {
  if (!href.startsWith("/") || href.startsWith("/#")) return false;
  return pathname === href.split("?")[0];
}

interface NavDropdownProps {
  id: string;
  label: string;
  items: readonly { href: string; label: string }[];
  active?: boolean;
}

function NavDropdown({ id, label, items, active = false }: NavDropdownProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [alignLeft, setAlignLeft] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelOpen = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = null;
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  // Close on route change (adjust state during render — no effect needed).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(
    () => () => {
      cancelOpen();
      cancelClose();
    },
    [],
  );

  // Collision-aware: open leftwards when the menu would cross the right edge.
  // Measured in the open handlers (menu is min-w-[16rem]).
  function openMenu() {
    const wrapper = wrapperRef.current?.getBoundingClientRect();
    setAlignLeft(!wrapper || wrapper.left + 256 <= window.innerWidth - 8);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function scheduleOpen() {
    cancelClose();
    if (openTimer.current) return;
    openTimer.current = setTimeout(() => openMenu(), HOVER_INTENT_MS);
  }

  function scheduleClose() {
    cancelOpen();
    if (closeTimer.current) return;
    closeTimer.current = setTimeout(() => setOpen(false), HOVER_INTENT_MS);
  }

  function onButtonKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      cancelOpen();
      openMenu();
      window.setTimeout(() => {
        menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
      }, 0);
    }
  }

  function onMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const links = Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    if (links.length === 0) return;
    const currentIndex = links.findIndex((link) => link === document.activeElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      links[(currentIndex + 1) % links.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      links[(currentIndex - 1 + links.length) % links.length]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (event.key === "Tab" && !event.shiftKey && currentIndex === links.length - 1) {
      setOpen(false);
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onPointerEnter={scheduleOpen}
      onPointerLeave={scheduleClose}
      onFocus={scheduleOpen}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={id}
        onClick={() => {
          cancelOpen();
          cancelClose();
          if (open) setOpen(false);
          else openMenu();
        }}
        onKeyDown={onButtonKeyDown}
        className={linkClass(active)}
      >
        [ {label} <span aria-hidden>▾</span> ]
      </button>
      {open ? (
        <div
          ref={menuRef}
          id={id}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          className={cn(
            "absolute top-full z-50 mt-2 flex min-w-[16rem] flex-col border border-dark-border bg-dark-surface py-1 shadow-brutal-muted",
            alignLeft ? "left-0" : "right-0",
          )}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              aria-current={isSameRoute(item.href, pathname) ? "page" : undefined}
              className={cn(
                "flex min-h-12 items-center px-4 font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:bg-dark-raised hover:text-accent-coral",
                isSameRoute(item.href, pathname) && "text-accent-coral",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isMac = useSyncExternalStore(subscribePlatform, getIsMac, getIsMacServer);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  const openPalette = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("sm:command-palette-open"));
    }
  }, []);

  // Close the sheet on route change (adjust state during render — no effect).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Esc closes the sheet.
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

  // Lock body scroll and make page content inert while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const main = document.getElementById("main-content");
    const footer = document.querySelector("footer");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    return () => {
      document.body.style.overflow = previousOverflow;
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    };
  }, [open]);

  // Focus trap: focus the sheet on open, cycle Tab inside it.
  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    if (!sheet) return;
    const first = sheet.querySelector<HTMLElement>("a, button");
    first?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !sheet) return;
      const focusables = Array.from(
        sheet.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      );
      if (focusables.length === 0) return;
      const firstEl = focusables[0] as HTMLElement;
      const lastEl = focusables[focusables.length - 1] as HTMLElement;
      if (!sheet.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastEl : firstEl).focus();
      } else if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Home scroll-spy: highlight the visible section.
  useEffect(() => {
    if (pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-80px 0px -55% 0px", threshold: [0.05, 0.3, 0.6] },
    );
    for (const id of SPY_SECTIONS) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [pathname]);

  const workActive = pathname.startsWith("/work");
  const servicesActive = pathname === "/" && activeSection === "services";
  const processActive = pathname === "/" && activeSection === "process";

  return (
    <header className="sticky top-0 z-50 border-b border-dark-border bg-dark/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-content items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5"
          onClick={close}
          aria-label="ScriptMønks home"
        >
          <Image
            src="/brand/logo-mark.png"
            alt="ScriptMønks"
            width={186}
            height={351}
            className="h-10 w-auto shrink-0"
            priority
          />
          <span className="min-w-0 truncate font-mono text-sm tracking-[0.2em] text-ink">
            scriptmønks
            <span aria-hidden className="animate-blink text-accent-coral">
              _
            </span>
          </span>
        </Link>

        {/* Center: primary nav, desktop only (≥1024 per SPEC_V5 §7.3) */}
        <nav aria-label="Primary" className="hidden flex-1 items-center justify-center gap-4 lg:flex xl:gap-6">
          <Link href="/#services" className={linkClass(servicesActive)} aria-current={servicesActive ? "location" : undefined}>
            [ SERVICES ]
          </Link>
          <Link href="/#process" className={linkClass(processActive)} aria-current={processActive ? "location" : undefined}>
            [ PROCESS ]
          </Link>

          <NavDropdown id="work-menu" label="WORK" items={WORK_MENU} active={workActive} />

          <Link href="/contact" className={linkClass(pathname === "/contact")} aria-current={pathname === "/contact" ? "page" : undefined}>
            [ CONTACT ]
          </Link>

          <NavDropdown id="more-menu" label="MORE" items={MORE_MENU} active={pathname === "/faq" || pathname === "/info"} />
        </nav>

        {/* Right: actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 lg:ml-0">
          <button
            type="button"
            onClick={openPalette}
            aria-label="Open command palette"
            className="hidden min-h-11 items-center gap-2 px-2 font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:text-accent-coral lg:inline-flex"
          >
            <span aria-hidden className="hidden xl:inline">
              {isMac ? "[ ⌘K ]" : "[ CTRL K ]"}
            </span>
            <Command size={16} aria-hidden className="xl:hidden" />
          </button>

          <span className="hidden lg:inline-flex">
            <ThemeSwitcher compact />
          </span>

          <Button href="/order" onClick={close} className="shrink-0">
            <span className="hidden xl:inline">ORDER PROJECT</span>
            <span className="xl:hidden">ORDER</span>
          </Button>

          <button
            ref={toggleRef}
            type="button"
            className="ml-1 shrink-0 border border-dark-border p-2 text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>

      {/* Mobile sheet: below the header, full remaining viewport, internal scroll */}
      {open ? (
        <div
          ref={sheetRef}
          id="mobile-nav"
          className="mobile-sheet fixed inset-x-0 top-[var(--header-h)] z-40 flex flex-col border-t border-dark-border bg-dark-surface lg:hidden"
        >
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
            <p aria-hidden className="px-0 pb-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-muted-teal">
              {"// NAVIGATE"}
            </p>
            <Link href="/#services" className={linkClass()} onClick={close}>
              [ SERVICES ]
            </Link>
            <Link href="/#process" className={linkClass()} onClick={close}>
              [ PROCESS ]
            </Link>
            <Link href="/#about" className={linkClass()} onClick={close}>
              [ ABOUT ]
            </Link>
            <Link href="/faq" className={linkClass()} onClick={close}>
              [ FAQ ]
            </Link>
            <Link href="/contact" className={linkClass()} onClick={close}>
              [ CONTACT ]
            </Link>

            <p aria-hidden className="px-0 pb-1 pt-5 font-mono text-[10px] uppercase tracking-widest text-muted-teal">
              {"// WORK"}
            </p>
            {WORK_MENU.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass()}
                onClick={close}
                aria-current={isSameRoute(item.href, pathname) ? "page" : undefined}
              >
                [ {item.label} ]
              </Link>
            ))}

            <p aria-hidden className="px-0 pb-1 pt-5 font-mono text-[10px] uppercase tracking-widest text-muted-teal">
              {"// TOOLS"}
            </p>
            <div className="flex min-h-12 items-center [&_button]:min-h-12">
              <ThemeSwitcher />
            </div>
            <button
              type="button"
              aria-label="Open command palette"
              className={linkClass()}
              onClick={() => {
                close();
                openPalette();
              }}
            >
              [ {isMac ? "⌘K" : "CTRL K"} PALETTE ]
            </button>

            <p aria-hidden className="px-0 pb-1 pt-5 font-mono text-[10px] uppercase tracking-widest text-muted-teal">
              {"// FOLLOW"}
            </p>
            {FOLLOW_MENU.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={linkClass()}
                onClick={close}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              >
                [ {item.label} ]
              </a>
            ))}
          </div>

          <div className="border-t border-dark-border bg-dark-surface px-4 pb-[env(safe-area-inset-bottom)] pt-3 sm:px-6">
            <Button href="/order" onClick={close} className="min-h-12 w-full">
              ORDER PROJECT
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
