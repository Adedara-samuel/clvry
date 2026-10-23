"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      className="text-muted-foreground hover:text-gold"
    >
      <SunIcon className="hidden dark:block" strokeWidth={1.5} />
      <MoonIcon className="dark:hidden" strokeWidth={1.5} />
    </Button>
  );
}
