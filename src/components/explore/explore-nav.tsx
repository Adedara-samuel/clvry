"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CrossMark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { exploreSections } from "@/lib/explore";
import { cn } from "@/lib/utils";

/**
 * Explore navigation: a vertical rail down the left edge from md up, a tab bar along the
 * bottom on phones. Same three links, Ethos first.
 */
export function ExploreNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop rail */}
      <nav
        aria-label="Explore"
        className="fixed inset-y-0 left-0 z-40 hidden w-24 flex-col items-center justify-between border-r border-border bg-background py-8 md:flex"
      >
        <Link href="/" aria-label="CLVRY home" className="text-gold transition hover:text-foreground">
          <CrossMark className="w-11" />
        </Link>

        <ul className="flex w-full flex-col gap-12">
          {exploreSections.map((s) => {
            const active = pathname === s.href;
            return (
              <li key={s.slug} className="relative flex justify-center">
                <Link
                  href={s.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex flex-col items-center gap-4 transition",
                    active ? "text-foreground" : "text-muted-foreground hover:text-gold",
                  )}
                >
                  <span className={cn("font-mono text-[10px] tracking-[0.2em]", active && "text-gold")}>{s.index}</span>
                  {/* Reads bottom-to-top, like a spine on a shelf */}
                  <span className="rotate-180 font-display text-sm uppercase tracking-[0.4em] [writing-mode:vertical-rl]">
                    {s.name}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 rotate-45 transition",
                      active ? "bg-wine ring-1 ring-gold" : "bg-transparent group-hover:bg-gold/50",
                    )}
                  />
                </Link>
                {/* Gold hairline on the rail's edge marks the open page */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-0 -right-px h-full w-px bg-gold transition-opacity duration-500",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col items-center gap-5">
          <ThemeToggle />
          <span className="rotate-180 font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground [writing-mode:vertical-rl]">
            CLVRY WRLD
          </span>
        </div>
      </nav>

      {/* Phone tab bar */}
      <nav
        aria-label="Explore"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      >
        <ul className="grid grid-cols-3">
          {exploreSections.map((s) => {
            const active = pathname === s.href;
            return (
              <li key={s.slug}>
                <Link
                  href={s.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-16 flex-col items-center justify-center gap-1.5 transition",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-8 top-0 h-px bg-gold transition-opacity duration-500",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className={cn("font-mono text-[9px] tracking-[0.2em]", active && "text-gold")}>{s.index}</span>
                  <span className="font-display text-xs uppercase tracking-[0.3em]">{s.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
