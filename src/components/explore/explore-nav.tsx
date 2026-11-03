"use client";

import { CrossIcon, Disc3Icon, ShirtIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CrossMark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { exploreSections, type ExploreSlug } from "@/lib/explore";
import { cn } from "@/lib/utils";

const icons: Record<ExploreSlug, typeof CrossIcon> = { ethos: CrossIcon, garment: ShirtIcon, events: Disc3Icon };

// Spring with a little overshoot, so the pill lands rather than stops.
const spring = "ease-[cubic-bezier(0.34,1.45,0.64,1)]";

/**
 * Phone dock behaviour: tuck away while scrolling down, return on any scroll up. Always shown
 * near the top and at the very bottom (where the "Continue" link is). Small jitters are ignored.
 */
function useTuckOnScroll() {
  const [tucked, setTucked] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const atBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 40;
        if (y < 80 || atBottom) {
          setTucked(false);
        } else if (Math.abs(y - last) > 6) {
          setTucked(y > last);
        } else {
          return;
        }
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return tucked;
}

/**
 * Explore navigation, Ethos first: frosted-glass docks floating over the page.
 *  - md+: a vertical capsule at the left edge. A glowing wine pill springs to the open section;
 *    hovering (or focusing) an icon slides out a glass preview card with the section's cover.
 *  - Phones: a capsule floating at the bottom, icon over label, with the same sliding pill.
 * The pills are the one rounded shape on the site: they read as light, not as UI chrome.
 */
export function ExploreNav() {
  const pathname = usePathname();
  const active = exploreSections.findIndex((s) => s.href === pathname);
  const tucked = useTuckOnScroll();

  return (
    <>
      {/* Desktop dock */}
      <nav
        aria-label="Explore"
        className="glass-dock fixed top-1/2 left-5 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 rounded-full p-2 md:flex"
      >
        <Link
          href="/"
          aria-label="CLVRY home"
          className="flex size-12 items-center justify-center rounded-full text-gold transition hover:bg-foreground/8 hover:text-foreground"
        >
          <CrossMark className="w-7" />
        </Link>
        <span aria-hidden className="h-px w-6 bg-foreground/15" />

        <ul className="relative flex flex-col gap-2">
          {/* The pill: 3rem items + 0.5rem gaps, so each step is 3.5rem */}
          <span
            aria-hidden
            className={cn(
              "dock-pill absolute top-0 left-0 size-12 rounded-full transition-[transform,opacity] duration-700",
              spring,
              active < 0 && "opacity-0",
            )}
            style={{ transform: `translateY(${Math.max(active, 0) * 3.5}rem)` }}
          />
          {exploreSections.map((s, i) => {
            const on = i === active;
            const Icon = icons[s.slug];
            return (
              <li key={s.slug} className="group relative">
                <Link
                  href={s.href}
                  aria-label={s.name}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "relative flex size-12 items-center justify-center rounded-full transition duration-300",
                    on ? "text-paper" : "text-muted-foreground hover:bg-foreground/8 hover:text-foreground",
                  )}
                >
                  <Icon strokeWidth={1.4} className="size-[1.15rem] transition-transform duration-300 group-hover:scale-110" />
                </Link>

                {/* Preview card */}
                <div
                  aria-hidden
                  className={cn(
                    "glass-dock pointer-events-none absolute top-1/2 left-full ml-5 w-52 -translate-x-2 -translate-y-1/2 rounded-3xl p-2 opacity-0 transition duration-300",
                    "group-hover:translate-x-0 group-hover:opacity-100 group-has-focus-visible:translate-x-0 group-has-focus-visible:opacity-100",
                  )}
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-ink-soft">
                    <Image src={s.cover.src} alt="" fill sizes="208px" className="object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-night/70 to-transparent" />
                    <span className="absolute bottom-2.5 left-3 font-mono text-[9px] tracking-[0.25em] text-goldenrod">
                      N° {s.index}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between px-2 pt-2.5 pb-1">
                    <span className="font-display text-sm uppercase tracking-[0.2em] text-foreground">{s.name}</span>
                    <span className="text-[11px] text-muted-foreground">{s.tagline}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <span aria-hidden className="h-px w-6 bg-foreground/15" />
        <ThemeToggle className="size-12 rounded-full" />
      </nav>

      {/* Phone dock */}
      <nav
        aria-label="Explore"
        className={cn(
          "fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] md:hidden",
          tucked && "pointer-events-none translate-y-[calc(100%+2rem)] opacity-0",
        )}
      >
        <ul className="glass-dock relative grid grid-cols-3 rounded-full p-1.5">
          <span
            aria-hidden
            className={cn(
              "dock-pill absolute inset-y-1.5 left-1.5 w-[calc((100%-0.75rem)/3)] rounded-full transition-[transform,opacity] duration-700",
              spring,
              active < 0 && "opacity-0",
            )}
            style={{ transform: `translateX(${Math.max(active, 0) * 100}%)` }}
          />
          {exploreSections.map((s, i) => {
            const on = i === active;
            const Icon = icons[s.slug];
            return (
              <li key={s.slug} className="relative">
                <Link
                  href={s.href}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "flex h-14 flex-col items-center justify-center gap-1 transition-colors duration-500",
                    on ? "text-paper" : "text-muted-foreground",
                  )}
                >
                  <Icon strokeWidth={1.4} className={cn("size-[1.1rem] transition-transform duration-500", on && "-translate-y-px scale-110")} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em]">{s.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
