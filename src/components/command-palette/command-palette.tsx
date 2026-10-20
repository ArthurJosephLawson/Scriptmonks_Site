"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { allProjects } from "@/data/portfolio";
import { siteConfig } from "@/data/site";
import { THEMES } from "@/lib/theme";
import { useTheme } from "@/components/layout/theme-provider";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const { setTheme } = useTheme();

  const toast = React.useCallback((message: string) => {
    window.dispatchEvent(new CustomEvent("sm:toast", { detail: message }));
  }, []);

  React.useEffect(() => {
    if (!open) {
      const id = setTimeout(() => setValue(""), 0);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [open]);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const navigate = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("[ COPIED ]");
    } catch {
      // ignore
    }
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={() => onOpenChange(false)} />
      <div className="relative mx-auto mt-[20vh] max-w-lg px-4">
        <Command
          label="Command palette"
          className="border border-dark-border bg-dark-surface shadow-brutal"
          shouldFilter
        >
          <div className="flex items-center gap-2 border-b border-dark-border px-4 py-3">
            <span className="font-mono text-xs text-muted-teal">{">"}</span>
            <Command.Input
              value={value}
              onValueChange={setValue}
              placeholder="Search..."
              className="w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-muted-teal"
              aria-label="Command palette"
            />
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="px-3 py-2 font-mono text-xs text-muted-teal">No results</Command.Empty>
            <Command.Group heading={<span className="px-2 font-mono text-xs uppercase tracking-widest text-muted-teal">Navigate</span>}>
              <Item onSelect={() => navigate("/")}>Home</Item>
              <Item onSelect={() => navigate("/#services")}>Services</Item>
              <Item onSelect={() => navigate("/#process")}>Process</Item>
              <Item onSelect={() => navigate("/work")}>Work</Item>
              <Item onSelect={() => navigate("/#about")}>About</Item>
              <Item onSelect={() => navigate("/faq")}>FAQ</Item>
              <Item onSelect={() => navigate("/contact")}>Contact</Item>
              <Item onSelect={() => navigate("/order")}>Order a project</Item>
            </Command.Group>
            <Command.Group heading={<span className="px-2 font-mono text-xs uppercase tracking-widest text-muted-teal">Projects</span>}>
              {allProjects.map((p) => (
                <Item key={p.slug} onSelect={() => navigate(`/work/${p.slug}`)}>
                  {p.title}
                </Item>
              ))}
            </Command.Group>
            <Command.Group heading={<span className="px-2 font-mono text-xs uppercase tracking-widest text-muted-teal">Theme</span>}>
              {THEMES.map((theme) => (
                <Item
                  key={theme.id}
                  onSelect={() => {
                    setTheme(theme.id);
                    toast(`[ THEME ] ${theme.label}`);
                    onOpenChange(false);
                  }}
                >
                  Theme: {theme.label}
                </Item>
              ))}
            </Command.Group>
            <Command.Group heading={<span className="px-2 font-mono text-xs uppercase tracking-widest text-muted-teal">Actions</span>}>
              <Item onSelect={() => copy(siteConfig.links.email)}>Copy email</Item>
              <Item onSelect={() => navigate(siteConfig.links.github.company)}>Open GitHub (company)</Item>
              <Item onSelect={() => navigate(siteConfig.links.github.dev)}>Open GitHub (developer)</Item>
              <Item onSelect={() => navigate(siteConfig.links.instagram)}>Open Instagram</Item>
              <Item onSelect={() => copy("npm install -g deploymonk")}>Copy DeployMonk install command</Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

function Item({ children, onSelect }: { children: React.ReactNode; onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className={cn(
        "flex cursor-pointer items-center px-2 py-2 font-mono text-sm text-ink",
        "aria-selected:bg-accent-coral aria-selected:text-dark",
      )}
    >
      {children}
    </Command.Item>
  );
}
