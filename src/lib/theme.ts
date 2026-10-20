// Theme catalogue + settings persistence (SPEC_V4 §3.1, §3.3).
// Pure module: all browser access is injected, so every branch is unit-testable.

export const THEME_IDS = ["coral", "cyan", "amber", "rose", "violet"] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  /** Accent triplet, formatted for `rgb(var(--accent-coral) / <alpha>)`. */
  accent: string;
  /** Dimmed accent triplet. */
  dim: string;
}

export const THEMES: readonly ThemeDefinition[] = [
  { id: "coral", label: "CORAL", accent: "255 122 101", dim: "200 91 75" },
  { id: "cyan", label: "CYAN", accent: "34 211 238", dim: "14 165 190" },
  { id: "amber", label: "AMBER", accent: "251 191 36", dim: "202 150 20" },
  { id: "rose", label: "ROSE", accent: "251 113 133", dim: "210 80 100" },
  { id: "violet", label: "VIOLET", accent: "167 139 250", dim: "130 105 210" },
] as const;

export interface Settings {
  theme: ThemeId;
  crt: boolean;
}

export const DEFAULT_SETTINGS: Settings = { theme: "coral", crt: false };

export const THEME_STORAGE_KEY = "sm_settings_v1";
/** Key shared with the XP/credits store (see SPEC_V3 settings.* keys). */
export const CREDITS_STORAGE_KEY = "sm_credits_v1";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && (THEME_IDS as readonly string[]).includes(value);
}

export function nextThemeId(current: ThemeId): ThemeId {
  const index = THEME_IDS.indexOf(current);
  if (index === -1) return THEME_IDS[1] ?? THEME_IDS[0];
  return THEME_IDS[(index + 1) % THEME_IDS.length] ?? THEME_IDS[0];
}

export function themeById(id: ThemeId): ThemeDefinition {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0]!;
}

/** Reads settings, coercing partial or corrupt payloads; never throws. */
export function readSettings(storage: StorageLike | null): Settings {
  if (!storage) return DEFAULT_SETTINGS;
  let raw: string | null = null;
  try {
    raw = storage.getItem(THEME_STORAGE_KEY);
  } catch {
    return DEFAULT_SETTINGS;
  }
  if (!raw) return DEFAULT_SETTINGS;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return DEFAULT_SETTINGS;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return DEFAULT_SETTINGS;
  }
  const record = parsed as Record<string, unknown>;
  return {
    theme: isThemeId(record.theme) ? record.theme : DEFAULT_SETTINGS.theme,
    crt: record.crt === true,
  };
}

/** Persists settings; never throws (storage may be blocked). */
export function writeSettings(storage: StorageLike | null, settings: Settings): void {
  if (!storage) return;
  try {
    storage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // storage blocked — the theme still applies for this page view
  }
}

/** Applies the theme to a root element without any library. */
export function applyThemeToRoot(root: HTMLElement, settings: Settings): void {
  root.dataset.theme = settings.theme;
  if (settings.crt) {
    root.dataset.crt = "on";
  } else {
    delete root.dataset.crt;
  }
}

/**
 * Pre-paint inline script (SPEC_V4 §3.3): reads storage and applies
 * `data-theme` / `data-crt` before first paint so there is no flash.
 * Kept as a string so it can be injected into <head> and unit-checked.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var r=document.documentElement;var s=window.localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(!s)return;var p=JSON.parse(s);var t=p&&p.theme;if(["coral","cyan","amber","rose","violet"].indexOf(t)>-1){r.dataset.theme=t;}if(p&&p.crt===true){r.dataset.crt="on";}}catch(e){}})();`;
