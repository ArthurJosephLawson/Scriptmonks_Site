import { describe, expect, it } from "vitest";
import {
  CREDITS_STORAGE_KEY,
  DEFAULT_SETTINGS,
  THEME_IDS,
  THEMES,
  THEME_STORAGE_KEY,
  applyThemeToRoot,
  isThemeId,
  nextThemeId,
  THEME_INIT_SCRIPT,
  readSettings,
  writeSettings,
} from "@/lib/theme";

function fakeStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    map,
  };
}

function throwingStorage() {
  return {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
    removeItem() {
      throw new Error("blocked");
    },
  };
}

describe("theme catalogue", () => {
  it("has the five spec themes in order with coral default first", () => {
    expect(THEME_IDS).toEqual(["coral", "cyan", "amber", "rose", "violet"]);
    expect(THEMES[0].id).toBe("coral");
    expect(THEMES[0].accent).toBe("255 122 101");
    expect(THEMES[0].dim).toBe("200 91 75");
  });

  it("matches the spec RGB triplets exactly", () => {
    const expected: Record<string, [string, string]> = {
      coral: ["255 122 101", "200 91 75"],
      cyan: ["34 211 238", "14 165 190"],
      amber: ["251 191 36", "202 150 20"],
      rose: ["251 113 133", "210 80 100"],
      violet: ["167 139 250", "130 105 210"],
    };
    for (const theme of THEMES) {
      expect([theme.accent, theme.dim]).toEqual(expected[theme.id]);
    }
  });

  it("defaults to coral with CRT off", () => {
    expect(DEFAULT_SETTINGS).toEqual({ theme: "coral", crt: false });
  });
});

describe("isThemeId", () => {
  it("accepts known ids and rejects anything else", () => {
    expect(isThemeId("violet")).toBe(true);
    expect(isThemeId("coral")).toBe(true);
    expect(isThemeId("blue")).toBe(false);
    expect(isThemeId("")).toBe(false);
    expect(isThemeId(null)).toBe(false);
    expect(isThemeId(7)).toBe(false);
  });
});

describe("nextThemeId", () => {
  it("wraps around the catalogue", () => {
    expect(nextThemeId("coral")).toBe("cyan");
    expect(nextThemeId("violet")).toBe("coral");
  });

  it("falls back to cyan from an unknown id", () => {
    expect(nextThemeId("nope" as never)).toBe("cyan");
  });
});

describe("readSettings / writeSettings", () => {
  it("returns defaults when nothing is stored", () => {
    expect(readSettings(fakeStorage())).toEqual(DEFAULT_SETTINGS);
  });

  it("round-trips stored settings", () => {
    const storage = fakeStorage();
    writeSettings(storage, { theme: "amber", crt: true });
    expect(storage.map.get(THEME_STORAGE_KEY)).toBe(
      '{"theme":"amber","crt":true}',
    );
    expect(readSettings(storage)).toEqual({ theme: "amber", crt: true });
  });

  it("ignores a corrupt payload", () => {
    expect(readSettings(fakeStorage({ sm_settings_v1: "{not json" }))).toEqual(DEFAULT_SETTINGS);
    expect(readSettings(fakeStorage({ sm_settings_v1: '{"theme":"blue"}' }))).toEqual(DEFAULT_SETTINGS);
    expect(readSettings(fakeStorage({ sm_settings_v1: '"amber"' }))).toEqual(DEFAULT_SETTINGS);
  });

  it("coerces a partial payload, keeping valid fields", () => {
    expect(readSettings(fakeStorage({ sm_settings_v1: '{"theme":"rose"}' }))).toEqual({
      theme: "rose",
      crt: false,
    });
    expect(readSettings(fakeStorage({ sm_settings_v1: '{"crt":true}' }))).toEqual({
      theme: "coral",
      crt: true,
    });
  });

  it("never throws when storage access is blocked", () => {
    expect(readSettings(throwingStorage())).toEqual(DEFAULT_SETTINGS);
    expect(() => writeSettings(throwingStorage(), DEFAULT_SETTINGS)).not.toThrow();
  });

  it("handles a null storage", () => {
    expect(readSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(() => writeSettings(null, DEFAULT_SETTINGS)).not.toThrow();
  });

  it("exposes the credits key used by the XP store", () => {
    expect(CREDITS_STORAGE_KEY).toBe("sm_credits_v1");
  });
});

describe("applyThemeToRoot", () => {
  it("sets data-theme and the CRT flag", () => {
    const root = { dataset: {}, style: {} } as unknown as HTMLElement;
    applyThemeToRoot(root, { theme: "cyan", crt: true });
    expect(root.dataset.theme).toBe("cyan");
    expect(root.dataset.crt).toBe("on");
  });

  it("clears the CRT flag when off", () => {
    const root = { dataset: { crt: "on" }, style: {} } as unknown as HTMLElement;
    applyThemeToRoot(root, DEFAULT_SETTINGS);
    expect(root.dataset.theme).toBe("coral");
    expect(root.dataset.crt).toBeUndefined();
  });
});

describe("THEME_INIT_SCRIPT", () => {
  it("reads the settings key and applies data-theme before paint", () => {
    expect(THEME_INIT_SCRIPT).toContain(THEME_STORAGE_KEY);
    expect(THEME_INIT_SCRIPT).toContain("data");
    expect(THEME_INIT_SCRIPT.startsWith("(function(){")).toBe(true);
    expect(THEME_INIT_SCRIPT).toContain("try{");
  });

  it("only accepts known theme ids", () => {
    for (const id of THEME_IDS) {
      expect(THEME_INIT_SCRIPT).toContain(`"${id}"`);
    }
  });

  it("is valid JavaScript", () => {
    expect(() => new Function(THEME_INIT_SCRIPT)).not.toThrow();
  });
});
