import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#09181B",
          surface: "#0D2125",
          raised: "#122A2F",
          border: "#1D3B41",
        },
        accent: {
          DEFAULT: "rgb(var(--accent-coral) / <alpha-value>)",
          coral: "rgb(var(--accent-coral) / <alpha-value>)",
          "coral-dim": "rgb(var(--accent-coral-dim) / <alpha-value>)",
        },
        muted: { teal: "#6F9399" },
        ink: "#E8F2F3",
        matrix: { dot: "#2A4A50" },
        status: { ok: "#5BE3A1" },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: { none: "0", sm: "2px", DEFAULT: "2px" },
      boxShadow: {
        brutal: "4px 4px 0 0 #FF7A65",
        "brutal-sm": "2px 2px 0 0 #FF7A65",
        "brutal-muted": "4px 4px 0 0 #1D3B41",
      },
      keyframes: {
        blink: { "0%,49%": { opacity: "1" }, "50%,100%": { opacity: "0" } },
        pulseDot: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(91,227,161,.55)" },
          "70%": { boxShadow: "0 0 0 8px rgba(91,227,161,0)" },
        },
      },
      animation: {
        blink: "blink 1s steps(1) infinite",
        "pulse-dot": "pulseDot 2s ease-out infinite",
      },
      maxWidth: { content: "72rem" },
    },
  },
  plugins: [],
};
export default config;
