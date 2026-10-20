"use client";

import * as React from "react";
import {
  DEFAULT_SETTINGS,
  THEME_STORAGE_KEY,
  applyThemeToRoot,
  readSettings,
  writeSettings,
  type Settings,
} from "@/lib/theme";

interface ThemeContextValue {
  settings: Settings;
  /** Commit a theme (persists + applies). */
  setTheme: (theme: Settings["theme"]) => void;
  /** Live preview without persisting (hover/arrow on desktop). */
  previewTheme: (theme: Settings["theme"] | null) => void;
  toggleCrt: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<Settings>(DEFAULT_SETTINGS);
  const [preview, setPreview] = React.useState<Settings["theme"] | null>(null);

  // Hydrate once from storage (pre-paint script already applied data-theme).
  React.useEffect(() => {
    const stored = readSettings(storage());
    const id = setTimeout(() => setSettings(stored), 0);
    return () => clearTimeout(id);
  }, []);

  // Apply whenever the committed or previewed theme changes.
  React.useEffect(() => {
    applyThemeToRoot(document.documentElement, {
      theme: preview ?? settings.theme,
      crt: settings.crt,
    });
  }, [settings, preview]);

  // Keep other tabs in sync.
  React.useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== null && event.key !== THEME_STORAGE_KEY) return;
      setSettings(readSettings(storage()));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = React.useCallback((next: Settings) => {
    setSettings(next);
    writeSettings(storage(), next);
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      settings,
      setTheme: (theme) => persist({ ...settings, theme }),
      previewTheme: setPreview,
      toggleCrt: () => persist({ ...settings, crt: !settings.crt }),
    }),
    [settings, persist],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    // Renders outside the provider (e.g. isolated tests) — inert fallback.
    return {
      settings: DEFAULT_SETTINGS,
      setTheme: () => {},
      previewTheme: () => {},
      toggleCrt: () => {},
    };
  }
  return context;
}
