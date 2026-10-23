"use client";

import { useTheme } from "@/store/theme";

export function ThemeToggle() {
  const setTheme = useTheme((s) => s.setTheme);

  // The resolved theme lives on <html data-theme>, set before hydration by the
  // init script, so the icons swap via CSS and server/client markup stay identical.
  function toggle() {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(current === "light" ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      className="flex size-8 items-center justify-center text-bone/70 transition hover:text-gold"
    >
      {/* Sun, shown in dark mode */}
      <svg viewBox="0 0 24 24" className="hidden size-4 dark:block" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      {/* Moon, shown in light mode */}
      <svg viewBox="0 0 24 24" className="size-4 dark:hidden" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
