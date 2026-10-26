"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/store/theme";

export function ThemeToggle({ className }: { className?: string }) {
  const setTheme = useTheme((s) => s.setTheme);

  // The resolved theme lives on <html data-theme>, set before hydration by the
  // init script, so the icons swap via CSS and server/client markup stay identical.
  function toggle() {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(current === "light" ? "dark" : "light");
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      className={cn("text-muted-foreground hover:text-gold", className)}
    >
      {/* Keyed to <html> rather than `dark:` so the icon stays right inside a pinned-dark
          section (e.g. the landing page). */}
      <SunIcon className="hidden [:root[data-theme=dark]_&]:block" strokeWidth={1.5} />
      <MoonIcon className="[:root[data-theme=dark]_&]:hidden" strokeWidth={1.5} />
    </Button>
  );
}
