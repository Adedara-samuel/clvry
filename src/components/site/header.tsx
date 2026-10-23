"use client";

import Link from "next/link";
import { HeartLogo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { useBag } from "@/store/bag";
import { useUi } from "@/store/ui";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "#shop", label: "Shop" },
  { href: "#story", label: "Story" },
  { href: "#circle", label: "Circle Sessions" },
];

export function Header() {
  const count = useBag((s) => s.items.length);
  const menuOpen = useUi((s) => s.menuOpen);
  const setMenuOpen = useUi((s) => s.setMenuOpen);

  return (
    <header className="sticky top-0 z-50 border-b border-bone/10 bg-ink/85 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-3 items-center px-5 md:px-8">
        <nav className="hidden gap-8 font-mono text-[11px] uppercase tracking-[0.2em] md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-bone/70 transition hover:text-gold">
              {l.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/70 md:hidden justify-self-start"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <Link href="/" aria-label="CLVRY home" className="justify-self-center">
          <HeartLogo className="w-20 text-bone transition hover:text-gold md:w-24" label="CLVRY" />
        </Link>

        <div className="flex items-center gap-3 justify-self-end font-mono text-[11px] uppercase tracking-[0.2em] text-bone/70">
          <ThemeToggle />
          <span>
            Bag <span className="text-gold">({count})</span>
          </span>
        </div>
      </div>

      <nav
        id="mobile-menu"
        className={cn(
          "overflow-hidden border-t border-bone/10 md:hidden",
          menuOpen ? "max-h-60" : "max-h-0 border-transparent",
          "transition-[max-height] duration-300",
        )}
      >
        <ul className="flex flex-col gap-5 px-5 py-6 font-display text-2xl">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setMenuOpen(false)} className="hover:text-gold">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
