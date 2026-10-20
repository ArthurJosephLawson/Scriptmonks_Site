import { THEME_INIT_SCRIPT } from "@/lib/theme";

/**
 * Pre-paint theme application (SPEC_V4 §3.3): runs before first paint so the
 * stored accent appears without a flash. Static string, no user input.
 */
export function ThemeInitScript() {
  return (
    <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
  );
}
